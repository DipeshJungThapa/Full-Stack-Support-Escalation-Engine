# Ticket Escalation System - Technical Specification

## Project Overview

**Type:** Internal Support / Ticket Management System  
**Architecture:** Django REST API + React Frontend + Supabase (via MCP)  
**Database:** Supabase PostgreSQL (accessed through MCP server)  
**Skill Level:** Beginner → Intermediate  
**Learning Focus:** Authentication, Authorization, RBAC, State Machines, MCP Integration

---

## Tech Stack

### Backend
- **Framework:** Django 4.2+ with Django REST Framework (DRF)
- **Database:** Supabase PostgreSQL (via MCP server - already configured)
- **Task Queue:** Celery + Redis (Level 4+)
- **Auth Progression:**
  - Level 1-3: Django Sessions with Supabase
  - Level 4: JWT (djangorestframework-simplejwt)
  - Level 5: Supabase Auth (native OAuth, row-level security)

### Frontend
- **Framework:** React 18+ with Vite
- **State:** Context API (AuthContext, RoleContext)
- **Routing:** React Router v6 with protected routes
- **HTTP Client:** Axios with interceptors

### Database & Infrastructure
- **Supabase:** PostgreSQL database, authentication, row-level security (RLS)
- **MCP Server:** Already connected in IDE with token `sbp_7648...fd4f`
- **Access Method:** Django connects to Supabase via database URL + MCP for admin operations

---

## Database Strategy with Supabase

### Why Supabase Works Here

✅ **Supabase provides:**
- PostgreSQL database (Django ORM compatible)
- Built-in authentication APIs (Level 5 enhancement)
- Row-Level Security (RLS) for permission enforcement
- Real-time subscriptions (optional future feature)
- Auto-generated REST APIs (we won't use, Django handles this)

### Django + Supabase Integration

**Level 1-3: Django handles everything**
```python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres',
        'USER': 'postgres',
        'PASSWORD': os.environ['SUPABASE_DB_PASSWORD'],
        'HOST': 'db.xxxxx.supabase.co',
        'PORT': '5432',
    }
}
```

**Django manages:**
- Models, migrations, ORM queries
- Authentication (Django sessions)
- All business logic

**Supabase provides:**
- Database hosting only

---

**Level 5: Hybrid Approach (Advanced)**
```python
# Use Supabase Auth for login/signup
# Django validates Supabase JWT tokens
# Django enforces business logic
# Supabase RLS provides database-level security layer
```

### MCP Server Usage

**Your MCP connection allows:**
- Database schema inspection from IDE
- Direct SQL queries for debugging
- Table browsing and data inspection
- Migration verification

**Django still handles:**
- All migrations (`python manage.py migrate`)
- ORM queries in application code
- Business logic and state machines

---

## User Roles & Permissions

```
USER    - Creates tickets, views own tickets
AGENT   - Views assigned tickets, updates status, internal comments
ADMIN   - Full access: all tickets, user management, rules
```

### Permission Matrix
| Action | User | Agent | Admin |
|--------|------|-------|-------|
| Create Ticket | ✓ | ✓ | ✓ |
| View Own Tickets | ✓ | - | - |
| View Assigned Tickets | - | ✓ | ✓ |
| View All Tickets | - | - | ✓ |
| Update Status | - | ✓ | ✓ |
| Assign Tickets | - | - | ✓ |
| Manage Users | - | - | ✓ |

**All permissions enforced at Django API level.**

---

## Data Models

### User (Django AbstractUser)
```python
email: unique
role: ['USER', 'AGENT', 'ADMIN']
is_active: boolean
```

### Ticket
```python
id: UUID
title: CharField(200)
description: TextField
status: ['OPEN', 'IN_PROGRESS', 'ESCALATED', 'RESOLVED', 'CLOSED']
priority: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
created_by: FK(User)
assigned_to: FK(User, null=True)
created_at: auto
updated_at: auto
last_activity_at: DateTime (for escalation)
```

### TicketComment
```python
ticket: FK(Ticket)
author: FK(User)
content: TextField
is_internal: boolean
created_at: auto
```

### EscalationRule (Level 4+)
```python
name: CharField(100)
priority_threshold: CharField
max_idle_hours: Integer
is_active: boolean
```

---

## State Machine

### Valid Transitions
```
OPEN → IN_PROGRESS
IN_PROGRESS → ESCALATED
IN_PROGRESS → RESOLVED
RESOLVED → CLOSED
ESCALATED → IN_PROGRESS
ESCALATED → RESOLVED

ADMIN bypasses all rules
```

### Enforcement
```python
# tickets/services.py
class TicketStatusService:
    @staticmethod
    def validate_transition(ticket, new_status, user):
        # Check role permissions
        # Validate state machine rules
        # Return True/False + error message
        
    @staticmethod
    def change_status(ticket, new_status, user):
        # Validate → Update → Log
```

---

## API Endpoints

### Authentication
```
POST   /api/auth/register/
POST   /api/auth/login/
POST   /api/auth/logout/
GET    /api/auth/me/
POST   /api/auth/token/             (Level 4+)
POST   /api/auth/token/refresh/     (Level 4+)
```

### Tickets
```
GET    /api/tickets/                - List (role-filtered)
POST   /api/tickets/                - Create
GET    /api/tickets/{id}/           - Retrieve
PATCH  /api/tickets/{id}/           - Update
POST   /api/tickets/{id}/status/    - Change status
POST   /api/tickets/{id}/assign/    - Assign (admin only)
GET    /api/tickets/{id}/comments/
POST   /api/tickets/{id}/comments/
```

### Admin
```
GET    /api/admin/users/
PATCH  /api/admin/users/{id}/
GET    /api/admin/rules/
POST   /api/admin/rules/
```

### Dashboard
```
GET    /api/dashboard/stats/
GET    /api/dashboard/my-tickets/      (User)
GET    /api/dashboard/assigned/        (Agent)
```

---

## Backend Structure

```
backend/
├── config/
│   ├── settings.py          # Supabase DB config here
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── authentication/
│   │   ├── models.py        # Custom User
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── permissions.py   # IsUser, IsAgent, IsAdmin
│   ├── tickets/
│   │   ├── models.py        # Ticket, Comment, Rule
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── permissions.py   # IsTicketOwnerOrAgent
│   │   ├── services.py      # StatusService, EscalationService
│   │   └── tasks.py         # Celery tasks (Level 4+)
│   └── dashboard/
│       └── views.py
└── requirements.txt
```

---

## Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── tickets/
│   │   │   ├── TicketList.jsx
│   │   │   ├── TicketDetail.jsx
│   │   │   ├── TicketForm.jsx
│   │   │   └── CommentSection.jsx
│   │   └── dashboard/
│   │       ├── UserDashboard.jsx
│   │       ├── AgentDashboard.jsx
│   │       └── AdminDashboard.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── api/
│   │   ├── axiosConfig.js
│   │   ├── authAPI.js
│   │   └── ticketsAPI.js
│   └── App.jsx
└── package.json
```

---

## Implementation Levels

### Level 1: Foundation
**Backend:**
- Django + DRF setup
- Connect to Supabase DB
- User model with email auth
- Basic ticket CRUD
- Session authentication

**Frontend:**
- Login/Register
- Create ticket
- View my tickets

**Supabase:**
- Use as PostgreSQL database only
- Run Django migrations against it

---

### Level 2: Roles & Structure
**Backend:**
- Add AGENT, ADMIN roles
- Permission classes
- Role-filtered querysets
- Ticket assignment
- Comments model

**Frontend:**
- Role-based dashboards
- Ticket assignment UI
- Comment section

---

### Level 3: State Machine
**Backend:**
- Expand status choices
- TicketStatusService with validation
- State transition endpoint
- Enforce rules at API level

**Frontend:**
- Status change controls
- Validation feedback
- State flow visualization

---

### Level 4: Automated Escalation
**Backend:**
- EscalationRule model
- Priority field
- Celery tasks for auto-escalation
- Admin rule management

**Frontend:**
- Priority selector
- Rule management UI
- Escalation indicators

---

### Level 5: Advanced Auth
**Backend:**
- Switch to JWT tokens
- OR integrate Supabase Auth fully
- OAuth with Google (via Supabase)

**Frontend:**
- JWT storage and refresh
- Google login button
- Token interceptors

**Supabase:**
- Use Supabase Auth APIs
- Row-Level Security policies
- JWT validation in Django

---

## Environment Variables

### Backend
```env
SECRET_KEY=
DEBUG=False
ALLOWED_HOSTS=localhost

# Supabase Database
SUPABASE_DB_PASSWORD=
DATABASE_URL=postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres

# Level 4+
CELERY_BROKER_URL=redis://localhost:6379/0

# Level 5 (if using Supabase Auth)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
```

### Frontend
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_SUPABASE_URL=https://xxxxx.supabase.co     # Level 5
VITE_SUPABASE_ANON_KEY=                         # Level 5
```

---

## Supabase-Specific Notes

### Initial Setup
1. **Supabase project already exists** (MCP connected)
2. Get database credentials from Supabase dashboard → Settings → Database
3. Copy connection string to `DATABASE_URL`
4. Run `python manage.py migrate` to create Django tables in Supabase

### MCP Server Benefits
- **Schema inspection:** View tables directly in IDE
- **Query testing:** Run SQL queries for debugging
- **Data browsing:** Check data without Django shell
- **Migration verification:** Confirm tables created correctly

### Row-Level Security (Level 5 Optional)
```sql
-- Example RLS policy in Supabase
CREATE POLICY "Users see own tickets"
ON tickets FOR SELECT
USING (auth.uid() = created_by);

CREATE POLICY "Agents see assigned tickets"
ON tickets FOR SELECT
USING (
  auth.uid() = assigned_to 
  OR auth.jwt() ->> 'role' = 'ADMIN'
);
```

**Note:** Django permissions still primary. RLS is defense-in-depth.

---

## Key Differences from Traditional Setup

### What's Different
- ✅ No need to install/manage PostgreSQL locally
- ✅ Database hosted and backed up automatically
- ✅ Can use Supabase dashboard for data inspection
- ✅ MCP server provides IDE integration
- ✅ Optional: Use Supabase Auth instead of Django auth (Level 5)

### What's the Same
- Django ORM works identically
- Migrations work normally
- Business logic stays in Django
- API structure unchanged
- Frontend code unchanged

---

## Development Commands

### Backend
```bash
# Setup
python -m venv venv
source venv/bin/activate
pip install django djangorestframework psycopg2-binary

# Configure Supabase DB in settings.py
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run server
python manage.py runserver
```

### Frontend
```bash
npm install
npm run dev
```

---

## Success Criteria

**Beginner Level:**
- Connect Django to Supabase successfully
- Implement session authentication
- Create role-based permissions
- Filter data by user role

**Intermediate Level:**
- Enforce state machine in services
- Implement background tasks (Celery)
- (Optional) Integrate Supabase Auth
- (Optional) Implement RLS policies

---

## Common Pitfalls

1. **Don't use Supabase auto-generated API** - Django handles all APIs
2. **Don't bypass Django ORM** - Always use models, not raw SQL
3. **Don't rely on frontend permissions** - Enforce at API level
4. **Don't skip migrations** - Always run against Supabase DB
5. **Don't confuse Supabase Auth with Django Auth** - Pick one strategy per level

---

**Document Version:** 2.0 (Supabase Edition)  
**Last Updated:** 2026-01-22  
**Database:** Supabase PostgreSQL via MCP  
**Target Completion:** 4-8 weeks