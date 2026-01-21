import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../providers/dashboard_provider.dart';
import '../../auth/providers/auth_provider.dart';
import '../../../core/theme/app_colors.dart';
import '../widgets/chart_widget.dart';
import '../widgets/expense_card.dart';
import 'add_transaction_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() => 
      context.read<DashboardProvider>().fetchDashboardData()
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: AppBar(
        title: Text('Dashboard', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: () => context.read<DashboardProvider>().fetchDashboardData(),
          ),
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: () => context.read<AuthProvider>().logout(),
          )
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const AddTransactionScreen()),
          );
        },
        backgroundColor: AppColors.primary,
        child: Icon(Icons.add, color: Colors.white),
      ),
      body: Consumer<DashboardProvider>(
        builder: (context, DashboardProvider dashboard, _) {
          if (dashboard.isLoading) {
            return Center(child: CircularProgressIndicator());
          }
          
          if (dashboard.error != null) {
             return Center(child: Text(dashboard.error!));
          }

          final stats = dashboard.stats;
          
          return RefreshIndicator(
            onRefresh: () => dashboard.fetchDashboardData(),
            child: SingleChildScrollView(
              physics: AlwaysScrollableScrollPhysics(),
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Balance Card
                  Container(
                    width: double.infinity,
                    padding: EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      gradient: AppColors.primaryGradient,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                         BoxShadow(
                           color: AppColors.primary.withOpacity(0.4),
                           blurRadius: 16,
                           offset: Offset(0, 8)
                         )
                      ]
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Total Balance', style: TextStyle(color: Colors.white70)),
                        SizedBox(height: 8),
                        Text(
                          '\$${stats?.balance.toStringAsFixed(2) ?? "0.00"}',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 32,
                            fontWeight: FontWeight.bold
                          ),
                        ),
                        SizedBox(height: 20),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                             _BalanceRowItem(
                               label: 'Monthly Spending',
                               value: '\$${stats?.monthlySpending.toStringAsFixed(2) ?? "0.00"}',
                               icon: Icons.arrow_downward,
                               color: AppColors.error
                             ),
                          ],
                        )
                      ],
                    ),
                  ).animate().fadeIn().slideY(begin: -0.2),

                  SizedBox(height: 24),
                  
                  // Chart Section
                  Text('Spending Breakdown', style: theme.textTheme.titleLarge)
                      .animate().fadeIn(delay: 200.ms),
                  SizedBox(height: 16),
                  
                  Card(
                    elevation: 4,
                    shadowColor: Colors.black12,
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: ChartWidget(
                        categories: stats?.categoryBreakdown ?? []
                      ),
                    ),
                  ).animate().fadeIn(delay: 300.ms).scale(),

                  SizedBox(height: 24),

                  // Recent Transactions
                  Text('Recent Transactions', style: theme.textTheme.titleLarge)
                       .animate().fadeIn(delay: 400.ms),
                  SizedBox(height: 8),
                  
                  if (dashboard.recentTransactions.isEmpty)
                    Padding(
                      padding: EdgeInsets.all(16),
                      child: Center(child: Text('No transactions yet')),
                    ),
                  
                  ListView.builder(
                    shrinkWrap: true,
                    physics: NeverScrollableScrollPhysics(),
                    itemCount: dashboard.recentTransactions.length,
                    itemBuilder: (context, index) {
                      return ExpenseCard(
                        transaction: dashboard.recentTransactions[index]
                      ).animate()
                       .fadeIn(delay: (400 + (index * 100)).ms)
                       .slideX(begin: 0.2);
                    },
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class _BalanceRowItem extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;

  const _BalanceRowItem({
    required this.label,
    required this.value,
    required this.icon,
    required this.color
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          padding: EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.white24,
            borderRadius: BorderRadius.circular(8)
          ),
          child: Icon(icon, color: Colors.white, size: 16),
        ),
        SizedBox(width: 12),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: TextStyle(color: Colors.white70, fontSize: 12)),
            Text(value, style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
          ],
        )
      ],
    );
  }
}
