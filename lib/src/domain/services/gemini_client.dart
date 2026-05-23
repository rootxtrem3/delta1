import 'dart:async';
import 'dart:convert';

import 'package:http/http.dart' as http;

import 'env_config.dart';

class GeminiResult {
  const GeminiResult({
    required this.model,
    required this.json,
  });

  final String model;
  final Map<String, Object?> json;
}

class GeminiClient {
  GeminiClient({
    required this.apiKey,
    this.httpClient,
    this.enableNetworkCalls = true,
  });

  final String apiKey;
  final http.Client? httpClient;
  final bool enableNetworkCalls;

  static const flashModel = 'gemini-2.5-flash';
  static const proModel = 'gemini-2.5-pro';

  factory GeminiClient.fromEnv({
    http.Client? httpClient,
    bool enableNetworkCalls = true,
  }) {
    return GeminiClient(
      apiKey: EnvConfig.geminiApiKey,
      httpClient: httpClient,
      enableNetworkCalls: enableNetworkCalls,
    );
  }

  Future<GeminiResult> generateJson({
    required String model,
    required Map<String, Object> prompt,
  }) async {
    if (!enableNetworkCalls || apiKey.isEmpty) {
      return GeminiResult(
        model: model,
        json: {
          'summary':
              'Local coaching fallback: recovery and sleep regularity need the most attention this week.',
          'coachingMessage':
              'Protect tonight\'s wind-down and front-load your hardest task before midday.',
          'focusArea': 'recovery',
        },
      );
    }

    final client = httpClient ?? http.Client();
    final response = await client.post(
      Uri.parse(
        'https://generativelanguage.googleapis.com/v1beta/models/$model:generateContent?key=$apiKey',
      ),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'contents': [
          {
            'parts': [
              {'text': jsonEncode(prompt)},
            ],
          },
        ],
        'generationConfig': {
          'responseMimeType': 'application/json',
        },
      }),
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('Gemini request failed with status ${response.statusCode}');
    }

    final payload = jsonDecode(response.body) as Map<String, dynamic>;
    final candidates = (payload['candidates'] as List<dynamic>? ?? []);
    final firstCandidate = candidates.isEmpty
        ? null
        : candidates.first as Map<String, dynamic>;
    final content = firstCandidate?['content'] as Map<String, dynamic>?;
    final text = content?['parts'] as List<dynamic>? ?? [];
    final rawJson = text.isEmpty
        ? '{}'
        : ((text.first as Map<String, dynamic>)['text'] as String? ?? '{}');

    return GeminiResult(
      model: model,
      json: (jsonDecode(rawJson) as Map).cast<String, Object?>(),
    );
  }

  Stream<String> streamText({
    required String model,
    required Map<String, Object> prompt,
  }) async* {
    if (!enableNetworkCalls || apiKey.isEmpty) {
      yield 'Local coach stream unavailable without Gemini API access.';
      return;
    }

    final client = httpClient ?? http.Client();
    final request = http.Request(
      'POST',
      Uri.parse(
        'https://generativelanguage.googleapis.com/v1beta/models/$model:streamGenerateContent?key=$apiKey',
      ),
    );
    request.headers['Content-Type'] = 'application/json';
    request.body = jsonEncode({
      'contents': [
        {
          'parts': [
            {'text': jsonEncode(prompt)},
          ],
        },
      ],
    });

    final response = await client.send(request);
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('Gemini stream failed with status ${response.statusCode}');
    }
    await for (final chunk in response.stream.transform(utf8.decoder)) {
      if (chunk.trim().isNotEmpty) {
        yield chunk;
      }
    }
  }
}
