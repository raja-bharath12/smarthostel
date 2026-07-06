# Smart Hostel — Leave Management System

A full-stack demo web application recreating a hostel leave-management portal:
login, apply leave, view leave history with pagination, cancel a submitted
leave, and view a multi-level (Faculty + Parent/IVR) approval workflow.

## Tech Stack

- **Backend:** Node.js + Express, organized in layers — **Model → Repository
  → Service → Controller → Route** — backed by a lightweight JSON-file data
  store (no native database dependencies to install; fully portable).
- **Frontend:** Plain HTML, CSS, and JavaScript (no build step), split into
  **services → components → controllers**, one file per responsibility.

## Project Structure

```
hostel-leave-app/
├── backend/
│   ├── server.js                     # Entry point: starts the Express app
│   ├── package.json
│   ├── data.json                      (auto-created on first run — seed data)
│   └── src/
│       ├── app.js                    # Express app config (middleware, static, routes)
│       ├── seed.js                   # First-run demo data seeding
│       ├── models/                   # Plain data models
│       │   ├── User.js
│       │   ├── Leave.js
│       │   ├── FacultyApproval.js
│       │   └── ParentApproval.js
│       ├── repositories/             # Data access layer (reads/writes data.json)
│       │   ├── jsonStore.js          # Low-level JSON file engine
│       │   ├── userRepository.js
│       │   ├── leaveRepository.js
│       │   └── approvalRepository.js
│       ├── services/                 # Business logic
│       │   ├── authService.js        # Login, sessions/tokens
│       │   └── leaveService.js        # Apply/list/cancel leave, approvals
│       ├── controllers/              # HTTP request/response handling
│       │   ├── authController.js
│       │   └── leaveController.js
│       ├── middleware/
│       │   └── authMiddleware.js     # Bearer-token auth guard
│       └── routes/                   # Express routers
│           ├── index.js               # Mounts /api/* routes
│           ├── authRoutes.js
│           └── leaveRoutes.js
│
└── frontend/
    ├── index.html                    # Thin redirect -> pages/login.html
    ├── pages/
    │   ├── login.html                 # Login page markup
    │   └── dashboard.html             # Leave Apply page markup (sidebar, table, modals)
    ├── css/
    │   └── style.css
    ├── assets/
    │   └── img/logo.svg
    └── js/
        ├── utils/
        │   └── helpers.js             # escapeHtml, formatServerTime
        ├── services/                  # All backend communication
        │   ├── apiClient.js           # fetch wrapper, auth headers, session
        │   ├── authService.js
        │   └── leaveService.js
        ├── components/                # Reusable UI pieces
        │   ├── toast.js
        │   ├── modal.js
        │   ├── leaveTable.js
        │   └── approvalDetails.js
        └── controllers/                # Page-level glue code
            ├── loginController.js
            └── dashboardController.js
```

### How a request flows through the backend

```
HTTP request
   → routes/*.js          (defines the URL + HTTP method)
   → middleware/authMiddleware.js   (checks the Bearer token)
   → controllers/*.js      (reads req, calls the right service, writes res)
   → services/*.js         (business rules: validation, workflow)
   → repositories/*.js     (talks to the data store)
   → models/*.js           (shapes the raw data into objects)
```

### How the frontend is wired

```
pages/*.html   loads scripts in this order:
   utils/helpers.js         → plain helper functions
   services/apiClient.js    → low-level fetch wrapper + session storage
   services/authService.js  → login/logout calls
   services/leaveService.js → leave list/apply/cancel/approval calls
   components/*.js          → toast, modal, table & approval renderers
   controllers/*.js         → wires the page's buttons/forms to the services
```

## Setup & Run

1. Make sure Node.js (v16+) is installed.
2. Install backend dependencies:
   ```bash
   cd hostel-leave-app/backend
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
4. Open your browser at **http://localhost:4000**

The server serves both the API (`/api/...`) and the static frontend files,
so you only need to run one process.

## Demo Login

| Field    | Value       |
|----------|-------------|
| Username | `24CS232`   |
| Password | `password123` |

On first run, `data.json` is created automatically with this demo user and
10 sample leave records (matching the "Submitted / Closed / Cancelled /
ForciblyClosed" statuses) plus a full faculty + parent approval chain, so
the app looks populated immediately — no manual DB setup needed.

## Features Implemented

- **Login / Logout** with a simple token-based session (in-memory on the server).
- **Leave Apply list** — paginated table (S.No, Leave Type, Application No,
  From, To, Accompanying Person, Call Count, Leave Reason, Status, Actions).
- **Apply Leave modal** — form with Leave Type, From/To Date, Accompanying
  Person, and Leave Reason, with basic validation (dates required, From
  must be in the future, To must be after From).
- **Cancel Leave** — only allowed while status is "Submitted".
- **Approval Details modal** — shows the Faculty Approval chain (IVR →
  Class Advisor → HOD → Deputy Warden → Residential Warden → Warden) and
  the Parent (IVR call) Approval Details with overall status.
- **Responsive layout** — sidebar collapses on small screens like the
  mobile screenshots.

## Notes for Your Project Report

- Replace `frontend/assets/img/logo.svg` and the institution name in
  `pages/login.html` / `pages/dashboard.html` with your own college's branding.
- The layered backend is designed so each piece can be explained on its own
  in a viva: **models** define shape, **repositories** handle storage,
  **services** hold business rules, **controllers** handle HTTP, **routes**
  wire URLs to controllers.
- `repositories/jsonStore.js` is intentionally simple (a single JSON file)
  so it's easy to read and explain — you can swap it for a real database
  (MySQL/MongoDB) later by rewriting only the repository layer; services,
  controllers, and routes stay the same.
- All passwords here are plain-text for demo simplicity — for a real
  deployment you'd hash passwords (e.g. with bcrypt) before storing them.
