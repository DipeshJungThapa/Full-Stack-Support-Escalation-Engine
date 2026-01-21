import 'package:dio/dio.dart';
import '../../../core/models/dashboard_stats.dart';
import '../../../core/models/transaction.dart';
import '../../../core/models/category.dart';
import '../../../services/api_service.dart';

class DashboardService {
  final ApiService _apiService = ApiService();

  Future<DashboardStats> getStats() async {
    final response = await _apiService.get('/transactions/dashboard_stats/');
    return DashboardStats.fromJson(response.data);
  }

  Future<List<Transaction>> getRecentTransactions() async {
    final response = await _apiService.get('/transactions/');
    // Assuming pagination or list
    if (response.data is List) {
      return (response.data as List).map((e) => Transaction.fromJson(e)).toList();
    } else if (response.data['results'] != null) {
      return (response.data['results'] as List).map((e) => Transaction.fromJson(e)).toList();
    }
    return [];
  }

  Future<List<Category>> getCategories() async {
    final response = await _apiService.get('/categories/');
    if (response.data is List) {
      return (response.data as List).map((e) => Category.fromJson(e)).toList();
    } else if (response.data['results'] != null) {
      return (response.data['results'] as List).map((e) => Category.fromJson(e)).toList();
    }
    return [];
  }

  Future<void> createTransaction(Map<String, dynamic> data) async {
    await _apiService.post('/transactions/', data);
  }
}

