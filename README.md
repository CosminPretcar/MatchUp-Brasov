# MatchUp Brasov

MatchUp Brasov is a sports platform for amateur players and sports facility
owners in Brasov, Romania. The application is designed to help players find
available pitches, join open matches, split payments, and manage their
registrations. Facility owners can use the platform to promote and manage
their venues.

The repository currently contains:

- A React and Vite landing page with responsive sections for players and
  facility owners.
- Login and registration flows connected to the backend API.
- An ASP.NET Core Web API with PostgreSQL persistence.
- BCrypt password hashing and role-aware user registration.
- A GitHub Pages workflow for deploying the frontend.

## Tech stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React

### Backend

- ASP.NET Core on .NET 10
- Entity Framework Core 10
- PostgreSQL through Npgsql
- BCrypt.Net for password hashing

## Repository structure

```text
.
├── backend/
│   └── MatchUp.Api/
│       ├── Controllers/   # HTTP API controllers
│       ├── Data/          # Entity Framework database context
│       ├── DTOs/          # Request and response models
│       ├── Migrations/    # Entity Framework migrations
│       └── Models/        # Domain models and enums
├── frontend/
│   ├── src/
│   │   ├── components/    # React UI components
│   │   └── assets/        # Images and SVG assets
│   └── package.json
└── .github/
    └── workflows/         # CI/CD workflows
```

## Prerequisites

- Node.js 20 or newer
- .NET SDK 10.0 or newer
- PostgreSQL

## Configuration

The API loads environment variables from a `.env` file in the backend working
directory through `DotNetEnv`. Configure the following database variables before
starting the API:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=matchup
DB_USER=postgres
DB_PASSWORD=your-password
JWT_KEY=replace-with-a-random-secret-at-least-32-bytes-long
```

`.env` files are ignored by Git. Do not commit real credentials.

The frontend reads the API base URL from `VITE_API_URL`; copy
`frontend/.env.example` to `frontend/.env.local` for local development. Use an
HTTPS URL, such as `https://localhost:7093`, and never commit the resulting
`.env.local` file.

## Running locally

### Start the backend

**First time only** — trust the .NET development certificate so the browser
accepts HTTPS on localhost:

```bash
dotnet dev-certs https --trust
```

Confirm the Windows security dialog that appears.

From the repository root:

```bash
cd backend/MatchUp.Api
dotnet restore
dotnet ef database update
dotnet run --launch-profile https
```

The API is available at `https://localhost:7093`.

The frontend and profile endpoints use this HTTPS URL by default. If you prefer
HTTP during local development, run `dotnet run --launch-profile http` and set
`VITE_API_URL=http://localhost:5056` in `frontend/.env.local`.

### Start the frontend

In a second terminal:

```bash
cd frontend
npm ci
npm run dev
```

Open the Vite development URL shown in the terminal, usually
`http://localhost:5173`.

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create a player or facility-owner account |
| `POST` | `/api/auth/login` | Authenticate an existing account |

Registration requires an email address, a password of at least six characters,
a full name, and an optional phone number. The supported roles are `Player`,
`FieldOwner`, and `Admin` at the domain-model level; the current frontend
registration form exposes `Player` and `FieldOwner`. Public registration cannot
create `Admin` accounts. The API returns a short-lived JWT after successful
registration or login; protected endpoints must validate this token server-side.

## Available scripts

Run these commands from `frontend/`:

```bash
npm run dev       # Start the Vite development server
npm run build     # Type-check and create a production build
npm run lint      # Run ESLint
npm run preview   # Preview the production build locally
```

## Deployment

The workflow in
`.github/workflows/deploy-frontend.yml` builds the frontend with Node.js 20
and deploys `frontend/dist` to GitHub Pages whenever changes are pushed to
`main` under `frontend/` or the workflow file itself.

For production deployment, configure the backend separately and replace the
frontend's local API URL with the public API URL. The Vite configuration uses
the `/MatchUp-Brasov/` base path for production builds.

## Current scope

The current implementation focuses on the public landing page and account
authentication. Match discovery, pitch booking, payments, WhatsApp
notifications, and facility-owner management are represented in the product
experience but are not yet exposed as backend features.
