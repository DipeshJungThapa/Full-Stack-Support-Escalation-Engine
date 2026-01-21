import 'category.dart';

class Transaction {
  final int id;
  final double amount;
  final String type; // INCOME or EXPENSE
  final DateTime date;
  final String note;
  final Category? category;
  final int? categoryId;

  Transaction({
    required this.id,
    required this.amount,
    required this.type,
    required this.date,
    required this.note,
    this.category,
    this.categoryId,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id'],
      amount: double.parse(json['amount'].toString()),
      type: json['type'],
      date: DateTime.parse(json['date']),
      note: json['note'] ?? '',
      category: json['category_detail'] != null 
          ? Category.fromJson(json['category_detail']) 
          : null,
      categoryId: json['category_id'],
    );
  }
}
