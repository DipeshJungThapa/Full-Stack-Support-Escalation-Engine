import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:intl/intl.dart';
import '../../../core/models/transaction.dart';
import '../../../core/theme/app_colors.dart';

class ExpenseCard extends StatelessWidget {
  final Transaction transaction;

  const ExpenseCard({super.key, required this.transaction});

  IconData _getIcon(String? iconName) {
    if (iconName == null) return FontAwesomeIcons.dollarSign;
    // Map string names to FontAwesomeIcons if need be, 
    // or rely on a helper. For now simplified mapping:
    switch (iconName) {
      case 'utensils': return FontAwesomeIcons.utensils;
      case 'bus': return FontAwesomeIcons.bus;
      case 'shopping-bag': return FontAwesomeIcons.bagShopping;
      case 'film': return FontAwesomeIcons.film;
      case 'file-invoice-dollar': return FontAwesomeIcons.fileInvoiceDollar;
      case 'money-bill-wave': return FontAwesomeIcons.moneyBillWave;
      case 'heartbeat': return FontAwesomeIcons.heartPulse;
      case 'graduation-cap': return FontAwesomeIcons.graduationCap;
      default: return FontAwesomeIcons.bagShopping;
    }
  }

  Color _getColor(String? colorHex) {
     if (colorHex == null) return AppColors.primary;
     return Color(int.parse(colorHex));
  }

  @override
  Widget build(BuildContext context) {
    final isIncome = transaction.type == 'INCOME';
    final amountColor = isIncome ? AppColors.success : AppColors.error;
    final prefix = isIncome ? '+' : '-';
    
    return Container(
      margin: EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: Offset(0, 4),
          )
        ],
      ),
      child: ListTile(
        leading: Container(
          padding: EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: _getColor(transaction.category?.color).withOpacity(0.2),
            borderRadius: BorderRadius.circular(12),
          ),
          child: FaIcon(
            _getIcon(transaction.category?.icon),
            color: _getColor(transaction.category?.color),
            size: 20,
          ),
        ),
        title: Text(
          transaction.category?.name ?? 'Unknown',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Text(
          DateFormat.yMMMd().format(transaction.date),
          style: TextStyle(color: Colors.grey),
        ),
        trailing: Text(
          '$prefix\$${transaction.amount.toStringAsFixed(2)}',
          style: TextStyle(
            color: amountColor,
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
      ),
    );
  }
}
