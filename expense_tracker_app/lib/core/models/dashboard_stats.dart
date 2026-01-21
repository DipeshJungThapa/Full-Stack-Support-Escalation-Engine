class DashboardStats {
  final double balance;
  final double monthlySpending;
  final List<CategorySpending> categoryBreakdown;

  DashboardStats({
    required this.balance,
    required this.monthlySpending,
    required this.categoryBreakdown,
  });

  factory DashboardStats.fromJson(Map<String, dynamic> json) {
    return DashboardStats(
      balance: double.parse(json['balance'].toString()),
      monthlySpending: double.parse(json['monthly_spending'].toString()),
      categoryBreakdown: (json['category_breakdown'] as List)
          .map((e) => CategorySpending.fromJson(e))
          .toList(),
    );
  }
}

class CategorySpending {
  final String categoryName;
  final String color;
  final double total;

  CategorySpending({
    required this.categoryName,
    required this.color,
    required this.total,
  });

  factory CategorySpending.fromJson(Map<String, dynamic> json) {
    return CategorySpending(
      categoryName: json['category__name'],
      color: json['category__color'],
      total: double.parse(json['total'].toString()),
    );
  }
}
