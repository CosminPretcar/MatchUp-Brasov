# MatchUp Brasov

<p align="center">
  <strong>Book the field. Find your team. Play the match.</strong>
</p>

<p align="center">
  A web platform for amateur players and sports facility owners in Brasov, Romania.
</p>

<p align="center">
  <a href="#features">Features</a> ·
  <a href="#local-development">Local development</a> ·
  <a href="#api">API</a> ·
  <a href="#roadmap">Roadmap</a>
</p>

---

## About the project

MatchUp Brasov connects amateur players with available sports fields in the
city. Players can discover fields and book time slots, while facility owners
can manage their fields and incoming bookings from a dedicated dashboard.

The application is a full-stack project built with:

- a React frontend;
- an ASP.NET Core API;
- PostgreSQL persistence;
- JWT authentication and role-based access.

## Project status

| Area | Status |
| --- | :---: |
| Responsive landing page | ✅ |
| Authentication and registration | ✅ |
| Player profile | ✅ |
| Field management | ✅ |
| Hourly bookings | ✅ |
| Player dashboard | ✅ |
| Facility-owner dashboard | ✅ |
| Romanian / English translations | ✅ |
| Matchmaking and online payments | 🚧 |

## Features

### Players

- browse fields by area and sport;
- view amenities such as floodlights, changing rooms, parking, and covered
  fields;
- view availability in one-hour slots;
- create, cancel, and review bookings;
- filter bookings by pending, confirmed, cancelled, or expired status;
- delete cancelled bookings from history;
- manage player profile details;
- switch the interface between Romanian and English.

### Facility owners

- create, edit, activate, and deactivate fields;
- review incoming bookings;
- confirm pending bookings;
- cancel bookings with a required reason;
- view booking counts, estimated revenue, and occupancy;
- use a daily booking calendar;
- prevent deletion of fields that have booking history;
- use role-specific navigation for fields and bookings.

### Booking rules

- each booking lasts one hour;
- the default schedule is 08:00–22:00 in the local Brasov timezone;
- bookings must start at an exact full hour;
- timestamps are stored in UTC and displayed in `Europe/Bucharest`;
- overlapping bookings are rejected;
- concurrent booking creation is protected by a serializable transaction;
- players can cancel at least 24 hours before the start time;
- past bookings are marked as `Expired`;
- only `Cancelled` bookings can be permanently deleted.

## Tech stack

### Frontend

![React](https://img.shields.io/badge/React-19-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React

### Backend

![.NET](https://img.shields.io/badge/.NET-10-512BD4?logo=dotnet&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)

- ASP.NET Core Web API
- Entity Framework Core 10
- PostgreSQL through Npgsql
- JWT Bearer Authentication
- BCrypt.Net password hashing

## Repository structure

```text
.
├── backend/
│   └── MatchUp.Api/
│       ├── Controllers/   # API endpoints
│       ├── Data/          # DbContext and relationship configuration
│       ├── DTOs/          # request and response contracts
│       ├── Migrations/    # Entity Framework migrations
│       └── Models/        # entities and enums
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # language context
│   │   ├── types/         # frontend types
│   │   └── utils/         # API and authentication helpers
│   └── package.json
└── .github/
    └── workflows/         # CI/CD workflows
```

## Requirements

- Node.js 20+
- .NET SDK 10+
- PostgreSQL

## Configuration

The API reads environment variables from `.env` in `backend/MatchUp.Api/`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=matchup
DB_USER=postgres
DB_PASSWORD=your-password
JWT_KEY=a-random-secret-at-least-32-bytes-long
```

For the frontend:

```powershell
Copy-Item frontend/.env.example frontend/.env.local
```

Set the API URL in `frontend/.env.local`:

```env
VITE_API_URL=https://localhost:7093
```

Never commit `.env` or `.env.local` files.

## Local development

### Start the backend

From the repository root:

```powershell
dotnet dev-certs https --trust
Set-Location backend/MatchUp.Api
dotnet restore
dotnet ef database update
dotnet run --launch-profile https
```

The API is normally available at `https://localhost:7093`.

### Start the frontend

In a second terminal:

```powershell
Set-Location frontend
npm ci
npm run dev
```

The frontend is normally available at `http://localhost:5173`.

## Useful commands

Run frontend commands from `frontend/`:

| Command | Description |
| --- | --- |
| `npm run dev` | start the development server |
| `npm run build` | type-check and create a production build |
| `npm run lint` | run ESLint |
| `npm run preview` | preview the production build locally |

Build the backend from the repository root:

```powershell
dotnet build backend/MatchUp.Api/MatchUp.Api.csproj
```

## API

Protected endpoints require:

```http
Authorization: Bearer <jwt>
```

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | create a player or facility-owner account |
| `POST` | `/api/auth/login` | authenticate an existing account |

### Fields

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/field` | list active fields and apply filters |
| `POST` | `/api/field` | create a field |
| `GET` | `/api/field/my-fields` | list the owner's fields |
| `PUT` | `/api/field/{id}` | update a field |
| `PATCH` | `/api/field/{id}/status` | activate or deactivate a field |
| `DELETE` | `/api/field/{id}` | delete a field without booking history |

### Bookings

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/Booking` | create a one-hour booking |
| `GET` | `/api/Booking/availability/{fieldId}` | get available hourly slots |
| `GET` | `/api/Booking/my-bookings` | list the authenticated player's bookings |
| `PATCH` | `/api/Booking/{id}/cancel` | cancel a booking as the player |
| `GET` | `/api/Booking/owner-bookings` | list bookings for the owner's fields |
| `GET` | `/api/Booking/owner-stats` | get owner booking statistics |
| `PATCH` | `/api/Booking/{id}/confirm` | confirm a pending booking |
| `PATCH` | `/api/Booking/{id}/cancel-owner` | cancel a booking with an owner's reason |
| `DELETE` | `/api/Booking/{id}` | delete a cancelled booking |

## Deployment

The workflow in `.github/workflows/deploy-frontend.yml` builds the frontend
with Node.js 20 and deploys `frontend/dist` to GitHub Pages when changes are
pushed to `main`.

The backend must be configured and hosted separately. For production, set
`VITE_API_URL` to the public API URL and keep secrets in the deployment
platform's environment variables.

## Roadmap

- [ ] Real matchmaking and joining open matches
- [ ] Online payments and cost splitting
- [ ] Email and WhatsApp notifications
- [ ] Configurable opening hours for each field
- [ ] Background job for automatic booking expiration
- [ ] Automated API and end-to-end tests

## Contributing

1. Create a branch for your change.
2. Run `npm run lint`, `npm run build`, and `dotnet build`.
3. Describe the change and testing steps in the pull request.

---

<p align="center">
  Built for the amateur football community in Brasov.
</p>
