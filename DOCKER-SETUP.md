# VyaaparAI — Docker Setup

## Prerequisites
- Docker Desktop running
- `backend/.env` containing your existing backend environment variables
- Google OAuth client ID available as `VITE_GOOGLE_CLIENT_ID`

## Build

From the project root:

```bash
docker compose --env-file .env build
```

## Start

```bash
docker compose --env-file .env up -d
```

## Check containers

```bash
docker compose ps
```

## Open the app

- Frontend: http://localhost
- Backend: http://localhost:8000
- Backend docs: http://localhost:8000/docs

## Stop

```bash
docker compose down
```

## Important
Do not commit or share `.env` files. Keep real API keys, database credentials, JWT secrets, and payment secrets outside the ZIP/repository.

The frontend uses `/api/...` through Nginx, which proxies API requests to the backend Docker service.
