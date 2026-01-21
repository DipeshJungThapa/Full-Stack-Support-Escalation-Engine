import 'package:flutter/material.dart';
import '../../../../core/models/dashboard_stats.dart';
import '../../../../core/models/transaction.dart';
import '../../../../core/models/category.dart';
import '../services/dashboard_service.dart';

class DashboardProvider with ChangeNotifier {
  final DashboardService _service = DashboardService();
  
  DashboardStats? _stats;
  List<Transaction> _recentTransactions = [];
  bool _isLoading = false;
  String? _error;

  DashboardStats? get stats => _stats;
  List<Transaction> get recentTransactions => _recentTransactions;
  bool get isLoading => _isLoading;
  String? get error => _error;

  List<Category> _categories = [];
  bool _isSaving = false;

  List<Category> get categories => _categories;
  bool get isSaving => _isSaving;

  Future<void> fetchDashboardData() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final statsResult = await _service.getStats();
      final transactionsResult = await _service.getRecentTransactions();
      
      _stats = statsResult;
      _recentTransactions = transactionsResult;
    } catch (e) {
      _error = 'Failed to load dashboard data: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchCategories() async {
    try {
      final result = await _service.getCategories();
      _categories = result;
      notifyListeners();
    } catch (e) {
      print('Failed to fetch categories: $e');
    }
  }

  Future<bool> addTransaction({
    required double amount,
    required String type,
    String? note,
    int? categoryId
  }) async {
    _isSaving = true;
    notifyListeners();
    
    try {
      await _service.createTransaction({
        'amount': amount,
        'type': type,
        'note': note,
        'category_id': categoryId,
        'date': DateTime.now().toIso8601String().split('T')[0] // today
      });
      
      await fetchDashboardData(); // Refresh data
      return true;
    } catch (e) {
      _error = 'Failed to save transaction';
      return false;
    } finally {
      _isSaving = false;
      notifyListeners();
    }
  }
}
