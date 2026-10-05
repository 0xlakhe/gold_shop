# Gold Shop Inventory

Gold Shop Inventory is a full-stack inventory dashboard for gold and silver shop operations. It provides authenticated inventory management, daily metal price tracking, sold-item workflows, and dashboard summaries for current stock and monthly sales.

## Live Links

- Standard frontend: https://gold-shop-zeta.vercel.app/dashboard
- AI-assisted variant: https://gold-shop-jqqfeofub-iizeds-projects.vercel.app/

## Features

- User registration and login with JWT-based authentication.
- User-scoped data isolation for item types, prices, inventory, and dashboard metrics.
- Gold and silver inventory CRUD with sold-item tracking.
- Item type management for categorizing inventory.
- Daily gold and silver price entry with latest-price and price-history endpoints.
- Dashboard metrics for unsold inventory value, item counts by type, monthly sold counts, and monthly profit.
- React frontend with protected dashboard, inventory, item type, price, and sold-item pages.

## Tech Stack

**Backend**

- FastAPI
- PostgreSQL
- SQLAlchemy
- Alembic
- JWT authentication with `python-jose`
- Passlib/bcrypt password hashing

**Frontend**

- React
- Vite
- React Router
- Axios
- Tailwind CSS

## Project Structure

```text
gold_shop/
├── backend/
│   ├── main.py                 # FastAPI app, CORS, router registration
│   ├── auth.py                 # Password hashing and JWT helpers
│   ├── database.py             # SQLAlchemy engine/session setup
│   ├── dependencies.py         # Authenticated user dependency
│   ├── models/                 # SQLAlchemy models and Pydantic schemas
│   ├── routes/                 # Auth, item types, prices, inventory, dashboard
│   ├── crud/                   # Database operation helpers
│   └── alembic/                # Database migrations
└── frontend/
    ├── src/
    │   ├── api/                # Axios API clients
    │   ├── components/         # Shared UI components
    │   └── pages/              # Login, dashboard, inventory, prices, etc.
    └── package.json
```

## Backend API Overview

Most endpoints, except registration and login, require a bearer token.

| Area | Endpoints |
| --- | --- |
| Auth | `POST /auth/register`, `POST /auth/login` |
| Item types | `POST /item-types/`, `GET /item-types/`, `PUT /item-types/{id}`, `DELETE /item-types/{id}` |
| Prices | `POST /prices/`, `GET /prices/latest`, `GET /prices/history` |
| Gold inventory | `POST /gold/`, `GET /gold/`, `GET /gold/sold`, `GET /gold/{id}`, `PUT /gold/{id}/sell`, `DELETE /gold/{id}` |
| Silver inventory | `POST /silver/`, `GET /silver/`, `GET /silver/sold`, `GET /silver/{id}`, `PUT /silver/{id}/sell`, `DELETE /silver/{id}` |
| Dashboard | `GET /dashboard/` |

## Local Setup

### Prerequisites

- Python 3.13+
- PostgreSQL
- Node.js and npm

### 1. Clone and enter the project

```bash
git clone https://github.com/0xlakhe/gold_shop.git
cd gold_shop
```

### 2. Configure the backend

Copy the example environment file and fill in your local values:

```bash
cp backend/.env.example backend/.env
```

`backend/.env`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/gold_shop
SECRET_KEY=replace-with-a-long-random-secret
```

Install backend dependencies and start the API:

```bash
cd backend
uv sync
uv run fastapi dev main.py
```

The API runs at `http://127.0.0.1:8000` by default.

### 3. Configure the frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` by default and uses `http://127.0.0.1:8000` as the API URL unless `VITE_API_URL` is set.

Optional frontend environment file:

```env
VITE_API_URL=http://127.0.0.1:8000
```

## Typical Workflow

1. Register a user or log in.
2. Create item types such as rings, chains, or bangles.
3. Add daily gold and silver prices.
4. Add gold or silver inventory items.
5. Mark items as sold with their selling price.
6. Review dashboard totals, inventory value, item counts, and monthly profit.

## Example Requests

Register:

```bash
curl -X POST http://127.0.0.1:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","email":"demo@example.com","password":"password123"}'
```

Login:

```bash
curl -X POST http://127.0.0.1:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"demo","password":"password123"}'
```

Set daily prices:

```bash
curl -X POST http://127.0.0.1:8000/prices/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"gold_price_per_tola":150000,"silver_price_per_tola":1900}'
```

Create an item type:

```bash
curl -X POST http://127.0.0.1:8000/item-types/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Ring"}'
```

Add a gold item:

```bash
curl -X POST http://127.0.0.1:8000/gold/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"item_type_id":1,"weight_tola":1.25,"karat":24,"purchase_price":180000,"item_note":"plain ring"}'
```

## Notes

- JWT access tokens expire after 24 hours.
- CORS is configured for local Vite development and deployed Vercel frontends.
- The backend initializes database tables on startup through SQLAlchemy metadata.
