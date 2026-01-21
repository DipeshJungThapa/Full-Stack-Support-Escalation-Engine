import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../providers/auth_provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/gradient_button.dart';
import 'signup_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          color: theme.scaffoldBackgroundColor,
        ),
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Icon(Icons.account_balance_wallet, size: 80, color: AppColors.primary)
                    .animate()
                    .scale(duration: 600.ms, curve: Curves.easeOutBack),
                SizedBox(height: 20),
                Text(
                  'Welcome Back!',
                  textAlign: TextAlign.center,
                  style: theme.textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.3),
                SizedBox(height: 40),
                
                Card(
                  elevation: 8,
                  shadowColor: Colors.black12,
                  child: Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Form(
                      key: _formKey,
                      child: Column(
                        children: [
                          TextFormField(
                            controller: _emailController,
                            decoration: InputDecoration(
                              labelText: 'Email',
                              prefixIcon: Icon(Icons.email_outlined),
                            ),
                            validator: (value) => 
                                value!.isEmpty ? 'Please enter email' : null,
                          ),
                          SizedBox(height: 20),
                          TextFormField(
                            controller: _passwordController,
                            decoration: InputDecoration(
                              labelText: 'Password',
                              prefixIcon: Icon(Icons.lock_outline),
                            ),
                            obscureText: true,
                            validator: (value) => 
                                value!.isEmpty ? 'Please enter password' : null,
                          ),
                          SizedBox(height: 30),
                          Consumer<AuthProvider>(
                            builder: (context, AuthProvider auth, _) {
                              if (auth.errorMessage != null) {
                                return Padding(
                                  padding: const EdgeInsets.only(bottom: 16.0),
                                  child: Text(
                                    auth.errorMessage!,
                                    style: TextStyle(color: AppColors.error),
                                  ),
                                );
                              }
                              return SizedBox.shrink();
                            },
                          ),
                          Consumer<AuthProvider>(
                            builder: (context, AuthProvider auth, _) => SizedBox(
                              width: double.infinity,
                              child: GradientButton(
                                onPressed: () async {
                                  if (_formKey.currentState!.validate()) {
                                    final success = await auth.login(
                                      _emailController.text, 
                                      _passwordController.text
                                    );
                                    if (success && context.mounted) {
                                      // Navigation will be handled by the wrapper/main
                                    }
                                  }
                                },
                                text: 'Login',
                                isLoading: auth.status == AuthStatus.loading,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ).animate().fadeIn(delay: 400.ms).slideY(begin: 0.3),
                
                SizedBox(height: 20),
                TextButton(
                  onPressed: () {
                    Navigator.push(
                      context, 
                      MaterialPageRoute(builder: (context) => SignupScreen())
                    );
                  },
                  child: Text("Don't have an account? Sign Up"),
                ).animate().fadeIn(delay: 600.ms),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
