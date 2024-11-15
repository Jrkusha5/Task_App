import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:task/onboarding_screen.dart';
void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Todo App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        textTheme: GoogleFonts.poppinsTextTheme(),
      ),
      home: OnboardingScreen(),
    );
  }
}
