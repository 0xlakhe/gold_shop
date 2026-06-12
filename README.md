# Gold Inventory

A full-stack gold and silver shop inventory system. The app helps a shop owner manage item types, daily metal prices, available stock, sold stock, monthly sales metrics, and user-specific inventory data.

## Features

- User registration and login with JWT authentication
- Protected frontend routes
- User-scoped data for item types, prices, gold items, and silver items
- Dashboard with current prices, inventory totals, and monthly sales summary
- Item type management with create, edit, and delete flows
- Gold inventory management with karat, weight, purchase price, sell flow, and delete flow
- Silver inventory management with purity, weight, purchase price, sell flow, and delete flow
- Daily gold/silver price setting and price history
- Sold item views with current-month filtering from the dashboard
- Cream-themed React UI with toast notifications

## Tech Stack

Backend:
- Python 3.13+
- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic
- JWT auth with `python-jose`
- Password hashing with `passlib` and `bcrypt`

Frontend:
- React 19
- Vite
- React Router
- Axios
- Tailwind CSS 4
- Lucide React icons

## Project Structure

```text
gold_inventory/
  backend/
    main.py                 FastAPI app entrypoint
    database.py             Database engine/session setup
    auth.py                 Password hashing and JWT helpers
    dependencies.py         Auth dependency for current user
    models/                 SQLAlchemy models and Pydantic schemas
    routes/                 API route modules
    crud/                   Database operation helpers
    alembic/                Database migrations
    pyproject.toml          Backend dependencies
  frontend/
    src/
      api/                  Axios API clients
      components/           Shared UI/components
      pages/                App pages
      App.jsx               Route definitions
      main.jsx              React entrypoint
      index.css             Tailwind and shared styles
    package.json            Frontend scripts/dependencies
```

## Requirements

- Python 3.13 or newer
- Node.js and npm
- PostgreSQL
- `uv` is recommended for backend dependency management because this project includes `uv.lock`

## Environment Variables

Create `backend/.env`:

```env
DATABASE_URL=postgresql://gold_user:password123@localhost/gold_shop
SECRET_KEY=replace-with-a-long-random-secret
```

Create `frontend/.env` if your API is not running at the default `http://127.0.0.1:8000`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

## Database Setup

Create a PostgreSQL database and user. Example:

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE gold_shop;
CREATE USER gold_user WITH PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE gold_shop TO gold_user;
\q
```

Make sure `DATABASE_URL` in `backend/.env` matches your local database credentials.

## Backend Setup

From the repository root:

```bash
cd backend
uv sync
```

Run migrations:

```bash
uv run alembic upgrade head
```

Start the backend:

```bash
uv run fastapi dev main.py
```

Alternative with Uvicorn:

```bash
uv run uvicorn main:app --reload
```

The backend should be available at:

```text
http://127.0.0.1:8000
```

Interactive API docs:

```text
http://127.0.0.1:8000/docs
```

## Frontend Setup

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend should be available at:

```text
http://localhost:5173
```

## Normal Local Development Flow

1. Start PostgreSQL.
2. Start the backend from `backend/`.
3. Start the frontend from `frontend/`.
4. Open `http://localhost:5173`.
5. Register a user.
6. Login.
7. Create item types.
8. Set today's metal prices.
9. Add gold/silver inventory.
10. Mark items as sold from the inventory page.

## Main API Areas

Auth:
- `POST /auth/register`
- `POST /auth/login`

Dashboard:
- `GET /dashboard`

Item types:
- Create, list, update, and delete item types

Prices:
- Set today's prices
- Get latest price
- Get price history

Gold:
- Add gold item
- List unsold gold items
- List sold gold items
- Sell gold item
- Delete unsold gold item

Silver:
- Add silver item
- List unsold silver items
- List sold silver items
- Sell silver item
- Delete unsold silver item

Most non-auth routes require an `Authorization: Bearer <token>` header. The frontend stores the login token in `localStorage` and attaches it through the Axios interceptor in `frontend/src/api/axios.js`.

## Frontend Scripts

Run from `frontend/`:

```bash
npm run dev      # start Vite dev server
npm run build    # production build
npm run lint     # run ESLint
npm run preview  # preview production build
```

## Backend Notes

- `backend/main.py` creates the FastAPI app, includes routers, and configures CORS.
- `backend/database.py` reads `DATABASE_URL` from `.env`.
- `backend/auth.py` reads `SECRET_KEY` from `.env`.
- Database tables are also created on app startup through `init_db()`, but Alembic migrations are still recommended for schema changes.
- The app supports both `postgres://` and `postgresql://` database URL formats.

## Deployment Notes

Frontend:
- The frontend is configured for Vercel with `frontend/vercel.json`.
- Set `VITE_API_URL` in the deployment environment to your production backend URL.

Backend:
- `backend/Procfile` contains:

```text
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

- Set `DATABASE_URL` and `SECRET_KEY` in the backend hosting environment.
- Make sure the production frontend origin is allowed in `CORSMiddleware` inside `backend/main.py`.

## Troubleshooting

If the frontend cannot reach the backend:
- Confirm the backend is running on `http://127.0.0.1:8000`.
- Confirm `frontend/.env` has the correct `VITE_API_URL`.
- Restart the Vite dev server after changing `.env`.

If you see a CORS error:
- Confirm the frontend origin is listed in `allow_origins` in `backend/main.py`.
- Check the backend terminal for the real error. Sometimes backend crashes appear in the browser as CORS errors.

If login-protected requests fail:
- Login again to refresh the token.
- Confirm `SECRET_KEY` is set in `backend/.env`.

If database connection fails:
- Confirm PostgreSQL is running.
- Confirm the database exists.
- Confirm `DATABASE_URL` credentials are correct.

## Verification Commands

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Backend syntax check:

```bash
python -m py_compile backend/main.py backend/database.py backend/auth.py
```

