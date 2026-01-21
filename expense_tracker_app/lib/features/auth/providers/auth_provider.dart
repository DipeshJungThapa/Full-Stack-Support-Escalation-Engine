import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:dio/dio.dart';
import '../../../services/api_service.dart';
import '../../../core/constants/api_constants.dart';

enum AuthStatus { initial, authenticated, unauthenticated, loading }

class AuthProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  AuthStatus _status = AuthStatus.initial;
  String? _errorMessage;

  AuthStatus get status => _status;
  String? get errorMessage => _errorMessage;

  Future<void> checkAuth() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('access_token');

    if (token != null) {
      _status = AuthStatus.authenticated;
    } else {
      _status = AuthStatus.unauthenticated;
    }
    notifyListeners();
  }

  Future<bool> login(String email, String password) async {
    _status = AuthStatus.loading;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiService.post(ApiConstants.login, {
        'email': email,
        'password': password,
      });

      final accessToken = response.data['access'];
      final refresh = response.data['refresh'];
      
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('access_token', accessToken);
      await prefs.setString('refresh_token', refresh);
      
      _status = AuthStatus.authenticated;
      notifyListeners();
      return true;
    } on DioException catch (e) {
      _status = AuthStatus.unauthenticated;
      _errorMessage = e.response?.data['detail'] ?? 'Login failed';
      notifyListeners();
      return false;
    } catch (e) {
      _status = AuthStatus.unauthenticated;
      _errorMessage = 'An unexpected error occurred';
      notifyListeners();
      return false;
    }
  }

  Future<bool> register(String email, String password, String name) async {
    _status = AuthStatus.loading;
    _errorMessage = null;
    notifyListeners();

    try {
      await _apiService.post(ApiConstants.register, {
        'email': email,
        'password': password,
        'name': name
      });
      
      // Auto login after register or ask user to login
      // For now, let's login automatically
      return await login(email, password);

    } on DioException catch (e) {
      _status = AuthStatus.unauthenticated;
      if (e.response?.data != null && e.response!.data is Map) {
         _errorMessage = (e.response!.data as Map).values.first.toString();
      } else {
         _errorMessage = 'Registration failed';
      }
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    _status = AuthStatus.unauthenticated;
    notifyListeners();
  }
}
