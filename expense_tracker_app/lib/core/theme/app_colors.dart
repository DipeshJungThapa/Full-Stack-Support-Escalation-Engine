import 'package:flutter/material.dart';

class AppColors {
  // Brand Colors
  static const Color primary = Color(0xFF6C63FF); // Modern Violet
  static const Color secondary = Color(0xFF03DAC6); // Teal Accent
  static const Color accent = Color(0xFFFF4081); // Pink Accent

  // Backgrounds
  static const Color backgroundLight = Color(0xFFF8F9FA);
  static const Color backgroundDark = Color(0xFF121212);
  static const Color surfaceLight = Colors.white;
  static const Color surfaceDark = Color(0xFF1E1E1E);

  // Text Colors
  static const Color textPrimaryLight = Color(0xFF2D3436);
  static const Color textSecondaryLight = Color(0xFF636E72);
  static const Color textPrimaryDark = Color(0xFFDFE6E9);
  static const Color textSecondaryDark = Color(0xFFB2BEC3);

  // Status Classes
  static const Color success = Color(0xFF00B894);
  static const Color error = Color(0xFFFF7675);
  static const Color warning = Color(0xFFFDCB6E);
  static const Color info = Color(0xFF74B9FF);

  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [Color(0xFF6C63FF), Color(0xFF4834D4)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  
  static const LinearGradient successGradient = LinearGradient(
    colors: [Color(0xFF00B894), Color(0xFF009172)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
