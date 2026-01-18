# Expense Tracker - Complete Setup

A full-stack expense tracking app with Flutter + Django.

For detailed documentation, see the main [README.md](../README.md)

## Quick Start

1. **Create virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run migrations**:
   ```bash
   python manage.py migrate
   ```

4. **Create admin user** (optional):
   ```bash
   python manage.py createsuperuser
   ```

5. **Start server**:
   ```bash
   python manage.py runserver
   ```

Server runs at: `http://127.0.0.1:8000`

Admin panel: `http://127.0.0.1:8000/admin`

## API Endpoints

- `POST /api/auth/register/` - Register
- `POST /api/auth/login/` - Login
- `GET /api/auth/me/` - Current user
- `GET /api/expenses/` - List expenses
- `POST /api/expenses/` - Create expense
- `PUT /api/expenses/{id}/` - Update expense
- `DELETE /api/expenses/{id}/` - Delete expense
