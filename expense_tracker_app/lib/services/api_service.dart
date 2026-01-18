import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/user.dart';
import '../models/expense.dart';
import 'auth_service.dart';

class ApiService {
  // For web/Chrome: use 127.0.0.1
  // For Android emulator: use 10.0.2.2
  // For physical device: use your computer's IP address
  static const String baseUrl = 'http://127.0.0.1:8000/api';
  
  final AuthService _authService = AuthService();

  // Get headers with authentication
  Future<Map<String, String>> _getHeaders() async {
    final token = await _authService.getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  // Register new user
  Future<Map<String, dynamic>> register({
    required String email,
    required String password,
    required String name,
  }) async {
    try {
      print('🔵 Attempting registration to: $baseUrl/auth/register/');
      
      final response = await http.post(
        Uri.parse('$baseUrl/auth/register/'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'password': password,
          'name': name,
        }),
      ).timeout(
        const Duration(seconds: 10),
        onTimeout: () {
          print('❌ Registration timeout - Cannot connect to server');
          throw Exception('Connection timeout. Is Django server running?');
        },
      );

      print('📡 Registration response status: ${response.statusCode}');
      print('📡 Registration response body: ${response.body}');

      if (response.statusCode == 201) {
        final data = jsonDecode(response.body);
        // Save auth data
        await _authService.saveAuthData(
          token: data['access'],
          userId: data['user']['id'],
          email: data['user']['email'],
          name: data['user']['name'],
        );
        print('✅ Registration successful!');
        return data;
      } else {
        print('❌ Registration failed: ${response.body}');
        throw Exception('Registration failed: ${response.body}');
      }
    } catch (e) {
      print('❌ Registration error: $e');
      rethrow;
    }
  }

  // Login user
  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    try {
      print('🔵 Attempting login to: $baseUrl/auth/login/');
      
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login/'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      ).timeout(
        const Duration(seconds: 10),
        onTimeout: () {
          print('❌ Login timeout - Cannot connect to server');
          throw Exception('Connection timeout. Is Django server running?');
        },
      );

      print('📡 Login response status: ${response.statusCode}');
      print('📡 Login response body: ${response.body}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        // Save auth data
        await _authService.saveAuthData(
          token: data['access'],
          userId: data['user']['id'],
          email: data['user']['email'],
          name: data['user']['name'],
        );
        print('✅ Login successful!');
        return data;
      } else {
        print('❌ Login failed: ${response.body}');
        throw Exception('Login failed: ${response.body}');
      }
    } catch (e) {
      print('❌ Login error: $e');
      rethrow;
    }
  }

  // Get all expenses
  Future<List<Expense>> getExpenses() async {
    final headers = await _getHeaders();
    final response = await http.get(
      Uri.parse('$baseUrl/expenses/'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => Expense.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load expenses: ${response.body}');
    }
  }

  // Create expense
  Future<Expense> createExpense(Expense expense) async {
    final headers = await _getHeaders();
    final response = await http.post(
      Uri.parse('$baseUrl/expenses/'),
      headers: headers,
      body: jsonEncode(expense.toJson()),
    );

    if (response.statusCode == 201) {
      return Expense.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to create expense: ${response.body}');
    }
  }

  // Update expense
  Future<Expense> updateExpense(Expense expense) async {
    final headers = await _getHeaders();
    final response = await http.put(
      Uri.parse('$baseUrl/expenses/${expense.id}/'),
      headers: headers,
      body: jsonEncode(expense.toJson()),
    );

    if (response.statusCode == 200) {
      return Expense.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to update expense: ${response.body}');
    }
  }

  // Delete expense
  Future<void> deleteExpense(int id) async {
    final headers = await _getHeaders();
    final response = await http.delete(
      Uri.parse('$baseUrl/expenses/$id/'),
      headers: headers,
    );

    if (response.statusCode != 204) {
      throw Exception('Failed to delete expense: ${response.body}');
    }
  }
}
