# PRD: EscalatePro - Support Escalation Engine

## 1. Project Overview
EscalatePro is a full-stack support ticketing system designed to ensure no high-priority issue goes unresolved. It features a "State Machine" for ticket life cycles and an "Automated Escalation" engine.

## 2. Target Audience
- Customer Support Teams (Agents)
- Support Managers (Admins)
- Internal Stakeholders (Regular Users)

## 3. Core Features
### Level 1: Foundation
- **Authentication:** Custom email-based login (no usernames).
- **Core CRUD:** Users can create and view support tickets.
- **Supabase Integration:** Real-time PostgreSQL database storage.

### Level 2: Roles (RBAC)
- **ADMIN:** Full control over all tickets and escalation rules.
- **AGENT:** Can "Claim" tickets and manage the resolution process.
- **USER:** Can create tickets and track their own status.

### Level 3: The State Machine
Tickets follow a strict workflow to prevent logical errors:
- `OPEN` ➔ `IN_PROGRESS` (When an agent claims a ticket)
- `IN_PROGRESS` ➔ `ESCALATED` or `RESOLVED`
- `RESOLVED` ➔ `CLOSED` (Final stage)

### Level 4: Automation Engine
- **Rules:** Admins define idle-time thresholds (e.g., "Escalate if inactive for 24h").
- **Background Tasks:** Powered by Celery/Redis to check ticket health automatically.
- **Manual Trigger:** (Added for Dev) A manual scan button for Admins.

### Level 5: Premium Analytics
- **Live Stats:** Real-time counters for ticket volume and resolution rates.
- **Short-IDs:** UUID-based tickets displayed as readable 8-character headers.

### Level 6: Production Mastery
- **Real File Uploads:** Use Supabase Storage for actual attachments on tickets/comments.
- **Email Alerts:** (System Extension) Automated notifications for escalations.

## 4. Technical Stack
- **Backend:** Python (Django + Django REST Framework)
- **Frontend:** React (Vite + Tailwind CSS + Lucide Icons)
- **Database:** Supabase (PostgreSQL)
- **In-Memory Store:** Redis (for background task queuing)

## 5. Deployment / Local Setup
- Backend: `/home/dipeshthapa/Code/Ticket/.venv/bin/python manage.py runserver`
- Redis (Required for Auto-Escalation): `sudo service redis-server start`
- Celery Task: `/home/dipeshthapa/Code/Ticket/.venv/bin/celery -A config worker -l info`
