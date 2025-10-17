# IT412 Authentication Project

This repository contains a simple authentication project with a Django backend and a Vite + React (TypeScript) frontend.

This README explains how to set up and run both the backend and the frontend on Windows (PowerShell) and how to use the provided VS Code tasks.

## Project layout

- `backend/` — Django project and REST API
- `frontend/` — Vite + React (TypeScript) frontend

## Requirements

- Python 3.10+ (or compatible)
- Node.js 16+ and npm
- Git (optional)
- PowerShell (Windows) — commands below are for PowerShell/cmd compatibility

## Backend (Django)

1. Create and activate a virtual environment (from the repository root):

```powershell
python -m venv venv
.\venv\Scripts\Activate
```

2. Install dependencies:

```powershell
pip install -r backend/requirements.txt
```

3. Apply migrations (optional if migrations already applied):

```powershell
cd backend
python manage.py migrate
```

4. Run the development server:

```powershell
python manage.py runserver
```

By default the server will run at `http://127.0.0.1:8000/`.

## Frontend (Vite + React)

1. Install node dependencies (from the `frontend/` folder):

```powershell
cd frontend
npm install
```

2. Run the dev server:

```powershell
npm run dev
```

Vite typically serves at `http://localhost:5173/` unless configured otherwise.

## Using the provided VS Code tasks

There are three helpful tasks configured in the workspace (see `.vscode/tasks.json` or the Tasks UI):

- `Start Backend` — activates the `venv` and starts Django. Command used:

```
cmd.exe /c venv\Scripts\activate && cd backend && python manage.py runserver
```

- `Start Frontend` — starts the Vite dev server. Command used:

```
cmd.exe /c cd frontend && npm run dev
```

- `Start All` — runs both `Start Backend` and `Start Frontend` in parallel.

To run tasks in VS Code: open the Command Palette (Ctrl+Shift+P) -> "Tasks: Run Task" -> choose the task.

Or run both from a PowerShell terminal manually (from repository root):

```powershell
# Start backend in one terminal
.\venv\Scripts\Activate; cd backend; python manage.py runserver

# In a second terminal for frontend
cd frontend; npm run dev
```

## Environment / API notes

- If the frontend needs to talk to the backend, ensure any API base URL used in `frontend/src/api.ts` points to the Django server (default: `http://127.0.0.1:8000/`).
- If CORS issues occur, enable/configure CORS in the Django settings or use a proxy in the Vite dev server.

## Troubleshooting

- "python" not found: ensure Python is installed and added to PATH. You can use the full path to python.exe if needed.
- Virtual environment activation errors: on Windows PowerShell, run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force` if you see script execution blocked.
- Port conflicts: change the port for Django (`python manage.py runserver 8001`) or Vite (`npm run dev -- --port 5174`).

## Development tips

- Keep backend and frontend terminals separate while developing.
- Commit migrations and frontend changes regularly.

