# Changelog - Engineering Refinements

I've made several adjustments to the code to make it more "cohesive" and developer-friendly. Here is what changed:

### ⚙️ Backend Logic & Consistency
- **Activity Tracking:** Fixed a bug where adding a comment didn't update the ticket's "Last Activity" time. Now, every reply resets the escalation timer.
- **Manual Engine Trigger:** Added a `scan_escalations` endpoint. You can now test the escalation logic without needing to run a Celery worker.
- **Flattened URLs:** Simplified the routing in `config/urls.py` so frontend calls match the backend naturally.

### 🎨 Frontend & UI Polishing
- **Readable IDs:** UUIDs are now sliced to 8-character headers (e.g., `#60566A55`) across all views.
- **Dynamic Timestamps:** Replaced "Mock dates" with real relative time (e.g., "5m ago", "Just now").
- **Manual Scan Button:** Added a "Run Escalation Engine" button in the Admin Rules tab.

### 📚 Documentation
- **[PRD.md](file:///home/dipeshthapa/Code/Ticket/PRD.md):** Created a master guide that explains the system architecture, roles, and the ticket life cycle.

---
**Why these changes?**
These updates reduce the "magic" happening in the background and ensure that the frontend and backend strictly follow the project's logic rules.
