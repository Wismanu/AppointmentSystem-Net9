# AGENTS.md - NailsFlow Development Guide

## Project Overview

NailsFlow is an appointment management system for nail salons consisting of:
- **Backend**: NailsFlow.Api - .NET 9 Web API with Entity Framework Core + SQL Server
- **Frontend**: NailsFlow-Web - React 19 + Vite + Tailwind CSS + JWT Authentication

## Build Commands

### Backend (.NET)

```bash
# Build the solution
dotnet build

# Build specific project
dotnet build NailsFlow.Api/NailsFlow.Api.csproj

# Run the API (requires SQL Server connection)
dotnet run --project NailsFlow.Api

# Run with development environment
dotnet run --project NailsFlow.Api --environment Development

# Run a single test
dotnet test --filter "FullyQualifiedName~TestClassName.MethodName"

# Create migration
dotnet ef migrations add MigrationName

# Apply migrations
dotnet ef database update

# Drop and recreate database
dotnet ef database drop --force
dotnet ef database update

# List pending migrations
dotnet ef migrations list
```

### Frontend (React)

```bash
# Install dependencies
cd NailsFlow-Web && npm install

# Development server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview

# Run a single ESLint file
npx eslint src/App.jsx
```

## Project Structure

```
AppointmentSystem-Net9/
├── SistemaCitasNails.sln
├── NailsFlow.Api/
│   ├── Controllers/       # API endpoints (Auth, Service, Customer, Appointment, Payment, Promotion, User, Rol)
│   ├── Models/           # Entity models
│   ├── Data/             # DbContext
│   ├── Migrations/       # EF Core migrations
│   └── Program.cs
└── NailsFlow-Web/
    ├── src/
    │   ├── api/          # Axios API client
    │   ├── components/   # Sidebar, ProtectedRoute
    │   ├── context/      # AuthContext
    │   ├── layouts/      # AdminLayout
    │   ├── pages/        # Login, Register, Services, Customers, Appointments, Promotions, Payments
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## Authentication

The system uses JWT authentication:
- **Login**: `POST /api/Auth/login` - Returns token and user data
- **Register**: `POST /api/Auth/register` - Registers new client users
- **Me**: `GET /api/Auth/me` - Get current user (requires auth)

### Test Users
| Username | Password | Role(s) |
|----------|----------|---------|
| admin | admin123 | Administrador |
| manicurista | manicura123 | Manicurista |
| wisman | wisman123 | Administrador + Manicurista |

## Code Style Guidelines

### C# Backend

#### Naming Conventions
- **Classes/Methods/Properties**: PascalCase (`AppointmentController`, `GetAppointments`)
- **Private fields**: PascalCase with underscore (`_context`, `_dbContext`)
- **Parameters/Local variables**: camelCase (`appointmentId`, `customerName`)
- **Interfaces**: Start with `I` (`IApplicationDbContext`)
- **Constants**: PascalCase (`MaxRetryCount`)

#### Imports
```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailsFlow.Api.Data;
using NailsFlow.Api.Models;
```

#### Types
- Enable nullable reference types (`<Nullable>enable</Nullable>`)
- Use `string?` for nullable strings
- Use `ActionResult<T>` for controller return types
- Use async/await for all database operations

#### Error Handling
- Return `NotFound()` for 404 responses
- Return `BadRequest()` for 400 responses
- Use try-catch with `DbUpdateConcurrencyException` handling

#### Entity Framework
- Use `[Column("name")]` for explicit column mapping
- Use `[ForeignKey("Id")]` for navigation properties
- Always use `.Include()` for related data in GET endpoints
- Use `async` database operations with `await`

#### API Controllers
- Use `[Route("api/[controller]")]`
- Inherit from `ControllerBase`
- Use `[HttpGet]`, `[HttpPost]`, `[HttpPut]`, `[HttpDelete]`
- Add `[Authorize]` attribute for protected routes

### React Frontend

#### Naming Conventions
- **Components**: PascalCase (`AdminLayout`, `ServicesPage`)
- **Files**: PascalCase with `.jsx` extension
- **Hooks**: camelCase starting with `use` (`useState`, `useEffect`)
- **Constants**: SCREAMING_SNAKE_CASE

#### Imports
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './context/AuthContext';
```

#### Component Structure
- Functional components with arrow functions or `function`
- Use React 19 patterns with hooks
- Destructure props for cleaner code
- Keep components focused and single-purpose

#### Styling
- Use Tailwind CSS utility classes
- Feminine color palette: pinks (#F8B4C4), purples (#E1BEE7)
- Responsive design: `md:`, `lg:` prefixes
- Use flex/grid for layout

#### State Management
- Use `useState` for local component state
- Use `useEffect` for side effects
- Use `AuthContext` for global auth state

#### API Integration
- Use axios configured in `src/api/api.js`
- Include JWT token automatically via interceptors
- Handle loading and error states

## Database

- **Provider**: SQL Server
- **ORM**: Entity Framework Core (Code First)
- **Connection**: `appsettings.json` - `"DefaultConnection"`
- **Migrations**: `NailsFlow.Api/Migrations/`

## Configuration Files

- **Backend**: `NailsFlow.Api/appsettings.json`, `appsettings.Development.json`
- **Frontend**: `NailsFlow-Web/vite.config.js`, `eslint.config.js`
- **Solution**: `SistemaCitasNails.sln`

## Testing

- Backend: `dotnet test` (xUnit/NUnit if configured)
- Frontend: `npm run lint`

## Notes

- API: `http://localhost:5000`
- Frontend: `http://localhost:5173`
- CORS allows `http://localhost:5173` only
- Swagger: `/swagger` (Development mode)
- Protected routes redirect to `/login`
- Token stored in localStorage
