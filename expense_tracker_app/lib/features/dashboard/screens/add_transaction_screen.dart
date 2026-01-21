import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../dashboard/providers/dashboard_provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/gradient_button.dart';
import '../../../core/models/category.dart';

class AddTransactionScreen extends StatefulWidget {
  const AddTransactionScreen({super.key});

  @override
  State<AddTransactionScreen> createState() => _AddTransactionScreenState();
}

class _AddTransactionScreenState extends State<AddTransactionScreen> {
  final _amountController = TextEditingController();
  final _noteController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  String _type = 'EXPENSE';
  Category? _selectedCategory;

  @override
  void initState() {
    super.initState();
    // Fetch categories if needed, but for now we assume we might need a separate 
    // fetch or hardcoded defaults if API isn't ready for categories listing.
    // DashboardProvider could load them.
    Future.microtask(() => context.read<DashboardProvider>().fetchCategories());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Add Transaction')),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Type Selector
              Row(
                children: [
                  Expanded(
                    child: ChoiceChip(
                      label: Text('Expense'),
                      selected: _type == 'EXPENSE',
                      onSelected: (selected) {
                        setState(() => _type = 'EXPENSE');
                      },
                      selectedColor: AppColors.error,
                      labelStyle: TextStyle(color: _type == 'EXPENSE' ? Colors.white : Colors.black),
                    ),
                  ),
                  SizedBox(width: 16),
                  Expanded(
                    child: ChoiceChip(
                      label: Text('Income'),
                      selected: _type == 'INCOME',
                      onSelected: (selected) {
                        setState(() => _type = 'INCOME');
                      },
                      selectedColor: AppColors.success,
                      labelStyle: TextStyle(color: _type == 'INCOME' ? Colors.white : Colors.black),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 24),

              TextFormField(
                controller: _amountController,
                keyboardType: TextInputType.numberWithOptions(decimal: true),
                decoration: InputDecoration(
                  labelText: 'Amount',
                  prefixIcon: Icon(Icons.attach_money),
                ),
                validator: (val) => val!.isEmpty ? 'Enter amount' : null,
              ),
              SizedBox(height: 16),

              TextFormField(
                controller: _noteController,
                decoration: InputDecoration(
                  labelText: 'Note (Optional)',
                  prefixIcon: Icon(Icons.note),
                ),
              ),
              SizedBox(height: 24),

              Text('Category', style: Theme.of(context).textTheme.titleMedium),
              SizedBox(height: 8),
              Consumer<DashboardProvider>(
                builder: (context, DashboardProvider provider, _) {
                  if (provider.categories.isEmpty) {
                    return Text('Loading categories...');
                  }
                  
                  return Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: provider.categories.map((cat) {
                      final isSelected = _selectedCategory?.id == cat.id;
                      return ChoiceChip(
                        label: Text(cat.name),
                        selected: isSelected,
                        onSelected: (selected) {
                          setState(() => _selectedCategory = selected ? cat : null);
                        },
                        selectedColor: AppColors.primary.withOpacity(0.2),
                      );
                    }).toList(),
                  );
                },
              ),
              SizedBox(height: 32),

              Consumer<DashboardProvider>(
                builder: (context, DashboardProvider provider, _) => GradientButton(
                  text: 'Save Transaction',
                  isLoading: provider.isSaving,
                  onPressed: () async {
                    if (_formKey.currentState!.validate()) {
                      // Basic validation for category
                      if (_selectedCategory == null && _type == 'EXPENSE') {
                         ScaffoldMessenger.of(context).showSnackBar(
                           SnackBar(content: Text('Please select a category'))
                         );
                         return;
                      }

                      final success = await provider.addTransaction(
                        amount: double.parse(_amountController.text),
                        type: _type,
                        note: _noteController.text,
                        categoryId: _selectedCategory?.id
                      );

                      if (success && context.mounted) {
                        Navigator.pop(context);
                      }
                    }
                  },
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
