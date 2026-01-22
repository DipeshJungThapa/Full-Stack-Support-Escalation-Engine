# Expense Tracker

A full-stack expense tracking application built with Flutter and Django.

## 🚀 Getting Started

This repository contains both frontend and backend code for the expense tracker application.

### Project Structure

- **Frontend**: Flutter mobile app
- **Backend**: Django REST API

## 📚 Tech Stack

- **Frontend**: Flutter/Dart
- **Backend**: Django/Python
- **Database**: PostgreSQL
- **Authentication**: JWT

## 🔧 Development

Clone the repository and follow setup instructions for each component.

```bash
git clone <repo-url>
```
│   └── .gitignore
│
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites

- Python 3.14+
- Flutter 3.38+
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
```

### 2. Backend Setup (Django)

```bash
cd expense_tracker_backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create admin user (optional)
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Backend will run at: `http://127.0.0.1:8000`

### 3. Frontend Setup (Flutter)

```bash
cd expense_tracker_app

# Get dependencies
flutter pub get

# Run on Chrome (for testing)
flutter run -d chrome

# Or run on Android emulator
flutter run
```

## 📱 Features

### User Authentication
- ✅ User registration
- ✅ Login with email/password
- ✅ JWT token authentication
- ✅ Persistent login (offline token storage)
- ✅ Logout functionality

### Expense Management
- ✅ Add new expenses
- ✅ View all expenses
- ✅ Edit existing expenses
- ✅ Delete expenses
- ✅ Categorize expenses (Food, Transport, Shopping, etc.)
- ✅ Date selection
- ✅ Total expense calculation

### UI/UX
- ✅ Clean, modern interface
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling
- ✅ Pull-to-refresh
- ✅ Responsive design

## 🔧 Configuration

### API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register/` | Register new user | No |
| POST | `/api/auth/login/` | Login user | No |
| GET | `/api/auth/me/` | Get current user | Yes |
| GET | `/api/expenses/` | List all expenses | Yes |
| POST | `/api/expenses/` | Create expense | Yes |
| PUT | `/api/expenses/{id}/` | Update expense | Yes |
| DELETE | `/api/expenses/{id}/` | Delete expense | Yes |

### Flutter API Configuration

Update the API URL in `lib/services/api_service.dart`:

```dart
// For web/Chrome
static const String baseUrl = 'http://127.0.0.1:8000/api';

// For Android emulator
static const String baseUrl = 'http://10.0.2.2:8000/api';

// For physical device (replace with your IP)
static const String baseUrl = 'http://YOUR_IP:8000/api';
```

## 🗄️ Database

**Development**: SQLite (file-based, no setup required)
- Database file: `expense_tracker_backend/db.sqlite3`
- Perfect for learning and development
- Can be upgraded to PostgreSQL for production

**View Data**:
```bash
# Django shell
python manage.py shell
>>> from api.models import User, Expense
>>> User.objects.all()

# Or use Django admin panel
python manage.py createsuperuser
# Visit: http://127.0.0.1:8000/admin
```

## 🧪 Testing

### Test Backend API

```bash
# Register user
curl -X POST http://127.0.0.1:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test User"}'

# Login
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Create expense (use token from login)
curl -X POST http://127.0.0.1:8000/api/expenses/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Lunch","amount":"15.50","category":"Food"}'
```

### Test Flutter App

1. Start Django backend
2. Run Flutter app: `flutter run -d chrome`
3. Register a new account
4. Add, edit, and delete expenses
5. Close and reopen app (should stay logged in)

## 🛠️ Tech Stack

### Backend
- **Framework**: Django 5.0.1
- **API**: Django REST Framework 3.14.0
- **Authentication**: djangorestframework-simplejwt 5.3.1
- **CORS**: django-cors-headers 4.3.1
- **Database**: SQLite (development)

### Frontend
- **Framework**: Flutter 3.38.7
- **Language**: Dart 3.10.7
- **HTTP Client**: http 1.6.0
- **Local Storage**: shared_preferences 2.5.4
- **Date Formatting**: intl 0.19.0

## 📚 What You'll Learn

### Backend Skills
- Django REST Framework setup
- Custom User model with email authentication
- JWT token generation and validation
- API endpoint design (CRUD)
- CORS configuration for mobile apps
- Database modeling and relationships

### Frontend Skills
- Flutter project structure
- State management with setState
- HTTP requests and async/await
- Form validation
- Local storage (SharedPreferences)
- Navigation between screens
- Error handling and loading states
- JSON serialization/deserialization

### Full-Stack Integration
- Mobile-backend communication
- Token-based authentication flow
- API error handling
- Offline data persistence
- Secure credential storage

## 🐛 Troubleshooting

### "Buffering forever" on login/register
- Ensure Django server is running
- Check API URL matches your setup (emulator vs web vs device)
- Look at terminal for debug messages

### "Connection refused"
- Django server not running
- Run: `python manage.py runserver`

### Can't run on Linux desktop
- Requires CMake installation
- Use Chrome instead: `flutter run -d chrome`

### "Email already exists"
- User already registered
- Use different email or check database

## 🚀 Deployment

### Backend (Django)
- Deploy to: Railway, Render, DigitalOcean, Heroku
- Switch to PostgreSQL for production
- Set up environment variables
- Configure ALLOWED_HOSTS and CORS

### Frontend (Flutter)
- Build APK: `flutter build apk`
- Build for iOS: `flutter build ios`
- Deploy web version: `flutter build web`
- Publish to Play Store / App Store

## 🤝 Contributing

This is a learning project, but feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is open source and available for learning purposes.

## 🎓 Next Steps

**Improve the App**:
- Add expense filtering by date/category
- Implement charts and analytics
- Add dark mode
- Export data to CSV
- Add expense categories with custom icons

**Advanced Features**:
- State management (Riverpod/Bloc)
- Unit and widget testing
- CI/CD pipeline
- Real-time sync
- Push notifications

**Deploy to Production**:
- Set up PostgreSQL
- Deploy backend to cloud
- Build and publish mobile app

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with ❤️ for learning Flutter and Django**
