import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import '../../../core/models/dashboard_stats.dart';

class ChartWidget extends StatelessWidget {
  final List<CategorySpending> categories;

  const ChartWidget({super.key, required this.categories});

  @override
  Widget build(BuildContext context) {
    if (categories.isEmpty) {
      return SizedBox(
        height: 200,
        child: Center(child: Text('No entries this month')),
      );
    }
    
    return SizedBox(
      height: 200,
      child: PieChart(
        PieChartData(
          sectionsSpace: 2,
          centerSpaceRadius: 40,
          sections: categories.map((cat) {
            final color = Color(int.parse(cat.color));
            return PieChartSectionData(
              color: color,
              value: cat.total,
              title: '',
              radius: 50,
              badgeWidget: _Badge(
                 cat.categoryName, 
                 size: 40, 
                 borderColor: color
              ),
              badgePositionPercentageOffset: 1.3,
            );
          }).toList(),
        ),
      ),
    );
  }
}

class _Badge extends StatelessWidget {
  final String text;
  final double size;
  final Color borderColor;

  const _Badge(this.text, {required this.size, required this.borderColor});

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: PieChart.defaultDuration,
      width: size * 1.5, // slightly wider for text
      height: size,
      decoration: BoxDecoration(
        color: Colors.white,
        shape: BoxShape.circle,
        border: Border.all(color: borderColor, width: 2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            offset: Offset(0, 2),
            blurRadius: 5,
          ),
        ],
      ),
      child: Center(
        child: Text(
          text.substring(0, 1), // First letter only for space
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.black),
        ),
      ),
    );
  }
}
