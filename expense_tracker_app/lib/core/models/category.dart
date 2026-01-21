class Category {
  final int id;
  final String name;
  final String icon;
  final String color;
  final bool isDefault;

  Category({
    required this.id,
    required this.name,
    required this.icon,
    required this.color,
    required this.isDefault,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'],
      name: json['name'],
      icon: json['icon'],
      color: json['color'],
      isDefault: json['is_default'] ?? false,
    );
  }
}
