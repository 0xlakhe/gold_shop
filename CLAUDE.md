# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Requirements

- Python 3.13+
- Node.js and npm
- PostgreSQL
- `uv` (Python package manager) — the project includes `uv.lock`

## Commands

### Setup
*   **PostgreSQL Setup:**
    ```bash
    sudo -u postgres psql
    CREATE DATABASE gold_shop;
    CREATE USER gold_user WITH PASSWORD 'password123';
    GRANT ALL PRIVILEGES ON DATABASE gold_shop TO gold_user;
    \q
    ```
    *Note: Ensure `DATABASE_URL` in `backend/.env` matches your local database credentials.*
*   **Backend Dependencies:**
    ```bash
    cd backend
    uv sync
    ```
*   **Frontend Dependencies:**
    ```bash
    cd frontend
    npm install
    ```

### Running the Application
*   **Run Backend:**
    ```bash
    cd backend
    uv run fastapi dev main.py
    ```
    *Alternative with Uvicorn:*
    ```bash
    uv run uvicorn main:app --reload
    ```
    (Backend available at `http://127.0.0.1:8000`, API docs at `http://127.0.0.1:8000/docs`)
*   **Run Frontend:**
    ```bash
    cd frontend
    npm run dev
    ```
    (Frontend available at `http://localhost:5173`)

### Database Migrations
*   **Run Migrations:**
    ```bash
    cd backend
    uv run alembic upgrade head
    ```

### Verification
*   **Frontend Lint & Build:**
    ```bash
    cd frontend
    npm run lint
    npm run build
    ```
*   **Backend Syntax Check:**
    ```bash
    python -m py_compile backend/main.py backend/database.py backend/auth.py
    ```

### Other Frontend Scripts
*   **Production Build:** `npm run build`
*   **Preview Production Build:** `npm run preview`
*   **Run ESLint:** `npm run lint`

## High-Level Code Architecture and Structure

This project is a full-stack application composed of a Python/FastAPI backend and a React/Vite/Tailwind CSS frontend.

### Backend (`backend/`)
*   **Entrypoint:** `main.py` - Initializes the FastAPI application, includes API routers, and configures CORS.
*   **Database:**
    *   `database.py` - Handles database engine and session setup, reading `DATABASE_URL` from `.env`.
    *   `models/models.py` - SQLAlchemy ORM models. `models/schemas.py` - Pydantic schemas for request/response validation.
    *   `alembic/` - Database migrations.
*   **Authentication:**
    *   `auth.py` - Password hashing (passlib + bcrypt) and JWT token management (python-jose).
    *   `dependencies.py` - FastAPI dependency to extract the current authenticated user from JWT.
*   **API Routes:** `routes/` - Modular route files for auth, item types, daily prices, gold items, silver items, dashboard.
*   **CRUD Operations:** `crud/` - Helper functions for database operations, one file per domain.
*   **AI Assistant:** `routes/assistant.py` - Natural-language assistant endpoint. `agent/` - Anthropic Claude SDK integration with function-calling tool definitions (`tools.py`) and tool execution logic (`executor.py`). The assistant can add/sell gold/silver items, set daily prices, query inventory, and generate profit reports.

### Frontend (`frontend/`)
*   **Entrypoints:** `main.jsx` (React application entry) and `App.jsx` (defines React Router routes).
*   **API Interaction:** `api/` - Houses Axios instances and client functions for interacting with the backend API. The `axios.js` file includes an interceptor for attaching JWT tokens from `localStorage`.
*   **UI Components:** `components/` - Contains reusable React UI components.
*   **Pages:** `pages/` - Defines the main views/pages of the application.
*   **Styling:** `index.css` - Includes Tailwind CSS directives and other global styles.

## Environment Variables

*   **Backend (`backend/.env`):**
    *   `DATABASE_URL`: PostgreSQL connection string (e.g., `postgresql://gold_user:password123@localhost/gold_shop`).
    *   `SECRET_KEY`: A long, random string for JWT token signing.
    *   `ANTHROPIC_AUTH_KEY`: API key for the Anthropic Claude SDK.
    *   `ANTHROPIC_BASE_URL` (optional): Base URL for the Anthropic API. Defaults to `https://api.anthropic.com`.
    *   `ANTHROPIC_MODEL` (optional): Model ID for the assistant. Defaults to `claude-sonnet-4-20250514`.
*   **Frontend (`frontend/.env` - if API is not default):**
    *   `VITE_API_URL`: URL of the backend API (e.g., `http://127.0.0.1:8000`).

## Main API Areas

All non-auth routes require `Authorization: Bearer <token>` header.

| Area | Key Endpoints |
|------|--------------|
| Auth | `POST /auth/register`, `POST /auth/login` |
| Dashboard | `GET /dashboard` |
| Item Types | CRUD at `/item-types` |
| Daily Prices | `GET /daily-prices/latest`, `GET /daily-prices/history` |
| Gold Items | CRUD at `/gold-items`, `POST /gold-items/{id}/sell` |
| Silver Items | CRUD at `/silver-items`, `POST /silver-items/{id}/sell` |
| Assistant | `POST /assistant/chat` (natural-language agent with tool calling) |

## Normal Local Development Flow

1.  Start PostgreSQL.
2.  Start the backend from `backend/` (`uv run fastapi dev main.py`).
3.  Start the frontend from `frontend/` (`npm run dev`).
4.  Open `http://localhost:5173`.
5.  Register and login a user.
6.  Proceed with creating item types, setting prices, and managing inventory.

## Deployment

- **Frontend:** Configured for Vercel (`frontend/vercel.json`). Set `VITE_API_URL` in production.
- **Backend:** `Procfile` for `uvicorn main:app --host 0.0.0.0 --port $PORT`. Set `DATABASE_URL` and `SECRET_KEY` in production. Ensure production frontend origin is in `CORSMiddleware` allow list.

## Troubleshooting

- **Frontend can't reach backend:** Confirm backend is running, `VITE_API_URL` is correct, and Vite dev server has been restarted after changing `.env`.
- **CORS errors:** Check that the frontend origin is in `allow_origins` in `main.py`. Backend crashes often appear as CORS errors in the browser — check backend terminal for the real error.
- **Auth failures:** Login again to refresh the token. Confirm `SECRET_KEY` is set in `backend/.env`.
- **Database connection fails:** Confirm PostgreSQL is running, the database exists, and `DATABASE_URL` credentials are correct.
