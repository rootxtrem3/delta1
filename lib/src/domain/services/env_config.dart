import 'package:flutter_dotenv/flutter_dotenv.dart';

class EnvConfig {
  EnvConfig._();

  static bool _loaded = false;

  static Future<void> load({String fileName = '.env'}) async {
    if (_loaded) {
      return;
    }

    await dotenv.load(fileName: fileName);
    _loaded = true;
  }

  static String get geminiApiKey => dotenv.env['GEMINI_API_KEY']?.trim() ?? '';
}
