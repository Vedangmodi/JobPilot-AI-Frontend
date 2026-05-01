# JobPilot AI Frontend

Frontend application for JobPilot AI, built with React + Vite.  
This app connects to the JobPilot backend APIs for authentication, applications, reminders, notes, AI tools, and AI history.

## Tech Stack

- React 19
- React Router
- Axios
- Tailwind CSS
- Vite
- ESLint

## Prerequisites

- Node.js 18+ (recommended 20+)
- npm
- Backend server running on `http://localhost:8080`

## Setup

```bash
npm install
npm run dev
```

App runs on:
- `http://localhost:5173` (default Vite port)

## Build and Lint

```bash
npm run lint
npm run build
npm run preview
```

## Backend Integration Overview

The frontend talks to backend through Axios client in `src/api/client.js`.

- Base URL is set to `http://localhost:8080`
- JWT token is stored in localStorage:
  - `jobpilot_token`
  - `jobpilot_user`
- Request interceptor:
  - Adds `Authorization: Bearer <token>` for protected API calls
  - Redirects to `/login` if user is unauthenticated and tries protected routes
- Response interceptor:
  - On `401`, clears auth storage and redirects to `/login`

## Frontend Auth Flow

1. User logs in or signs up from:
   - `src/pages/LoginPage.jsx`
   - `src/pages/SignupPage.jsx`
2. Backend returns `token`, `name`, `email`
3. `setAuth()` in `src/context/AuthContext.jsx` stores token + user
4. `ProtectedRoute` (`src/components/ProtectedRoute.jsx`) guards private pages
5. `Layout` (`src/components/Layout.jsx`) provides navigation + logout

## Routes and Feature Mapping

Routes are defined in `src/App.jsx`.

- `/dashboard` -> `DashboardPage`
  - GET `/api/dashboard/stats`
- `/applications` -> `ApplicationsPage`
  - GET `/api/applications/pagination`
  - GET `/api/applications/filter`
- `/applications/new` -> `NewApplicationPage`
  - POST `/api/applications`
- `/applications/:id` -> `ApplicationDetailPage`
  - GET `/api/applications/{id}`
  - PUT `/api/applications/{id}`
  - DELETE `/api/applications/{id}`
  - Notes:
    - GET `/api/applications/{id}/notes`
    - POST `/api/applications/{id}/notes`
    - DELETE `/api/notes/{noteId}`
  - Reminders:
    - GET `/api/applications/{id}/reminders`
    - POST `/api/applications/{id}/reminders`
    - PUT `/api/reminders/{reminderId}/complete`
    - DELETE `/api/reminders/{reminderId}`
- `/ai-tools` -> `AIToolsPage`
  - POST `/api/ai/resume-improver`
  - POST `/api/ai/jd-analyzer`
  - POST `/api/ai/interview-questions`
- `/ai-history` -> `AIHistoryPage`
  - GET `/api/ai/history`

## Constants and Shared Utilities

- `src/utils/constants.js`
  - application statuses
  - source types
  - AI feature config
- `src/utils/format.js`
  - date/date-time formatting
  - text truncation for UI tables

## Project Structure

```text
src/
  api/
    client.js
  components/
    Layout.jsx
    ProtectedRoute.jsx
    FormField.jsx
    Spinner.jsx
  context/
    AuthContext.jsx
    AuthContextValue.jsx
    useAuth.jsx
  pages/
    LoginPage.jsx
    SignupPage.jsx
    DashboardPage.jsx
    ApplicationsPage.jsx
    NewApplicationPage.jsx
    ApplicationDetailPage.jsx
    AIToolsPage.jsx
    AIHistoryPage.jsx
    NotFoundPage.jsx
  utils/
    constants.js
    format.js
```

## Notes for Production

- Move backend URL to environment variable (e.g. `VITE_API_BASE_URL`)
- Add centralized error toast/notification system
- Add route-level loading skeletons for smoother UX
- Add tests for auth guards and critical API flows

## Interview Prep Document

For interview-ready explanation of architecture and API integration, read:

- `docs/frontend-interview-prep.md`
