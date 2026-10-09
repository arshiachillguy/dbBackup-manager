# AGENTS.md — Backup Manager Project Rules

These rules are permanent and apply to all work in this project.

## Scope and ownership

- **Backend files are READ-ONLY.** The Spring Boot backend lives in
  `backup-manager/` (Java, Maven, PostgreSQL). Never create, modify, rename,
  move, or delete any backend file, including but not limited to Java sources,
  `pom.xml`, `application.properties`, entities, repositories, services,
  controllers, DTOs, security configuration, the JWT implementation, and
  backend API endpoints.
- **Only frontend files may be created or modified**, except for `AGENTS.md`
  itself.
- The frontend lives in `frontend/` (React + TypeScript + Vite).
- Never delete, rename, move, or overwrite backend files.
- Do not run destructive commands against the repository.

## Working rules

- **Inspect existing files before editing.** Read a file's contents and
  understand surrounding context before changing it.
- **Follow the real API contract.** Read the backend code to confirm endpoints,
  request fields, response fields, status codes, and authentication flow.
  Never invent endpoints, payloads, or authentication behavior.
- **Ask for permission if a task requires backend changes.** If a frontend
  integration is blocked by a backend limitation (for example, missing CORS
  headers), STOP and explain the blocker. Do not modify the backend to fix it.
- **Keep frontend code organized and reusable.** Separate API access, types,
  hooks, and UI components.
- **Never hardcode credentials or secrets.** Backend URL comes from the
  `VITE_API_BASE_URL` environment variable. Do not log passwords, tokens, or
  secrets.

## Reporting

- After each task, explain which files were changed and which were not.
- Confirm explicitly when no backend files were modified.

## Backend reference (for frontend integration only)

- Base URL (dev): `http://localhost:8080` (Spring Boot default port).
- `POST /api/auth/register` — body `{ "username", "email", "password" }`
  → `{ "id", "username", "email" }`.
- `POST /api/auth/login` — body `{ "username", "password" }`
  → `{ "id", "username", "email", "token" }`.
- Passwords must be **at least 15 characters** (also max 150).
- Authenticate subsequent requests with `Authorization: Bearer <token>`.
