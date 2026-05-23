import 'package:flutter/material.dart';

class AdaptiveWellnessAiApp extends StatelessWidget {
  const AdaptiveWellnessAiApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Adaptive Wellness AI',
      debugShowCheckedModeBanner: false,
      home: const _PlaceholderScreen(),
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF0B6E4F)),
      ),
    );
  }
}

class _PlaceholderScreen extends StatelessWidget {
  const _PlaceholderScreen();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Padding(
          padding: EdgeInsets.all(24),
          child: Text(
            'This repository currently ships the AI integration layer, demo data, and analysis pipeline. App UI and backend wiring are intentionally not included yet.',
            textAlign: TextAlign.center,
          ),
        ),
      ),
    );
  }
}
