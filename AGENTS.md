# AGENTS.md - NailsFlow Development Guide

## Project Overview

NailsFlow is an appointment management system for nail salons:
- **Backend**: NailsFlow.Api - .NET 9 Web API + Entity Framework Core + SQL Server
- **Frontend**: NailsFlow-Web - React 19 + Vite + Tailwind CSS + JWT Authentication

## Build Commands

### Backend (.NET)
```bash
# Build solution / specific project
dotnet build
dotnet build NailsFlow.Api/NailsFlow.Api.csproj

# Run API (port 5005)
dotnet run --project NailsFlow.Api --environment Development

# Run tests (no test project currently)
dotnet test
dotnet test --filter "FullyQualifiedName~Namespace.ClassName.MethodName"

# EF Core migrations
dotnet ef migrations add MigrationName --project NailsFlow.Api
dotnet ef database update --project NailsFlow.Api
dotnet ef migrations list --project NailsFlow.Api
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

# Run single ESLint file
npx eslint src/App.jsx
```

## Project Structure
```
AppointmentSystem-Net9/
├── SistemaCitasNails.sln
├── NailsFlow.Api/
│   ├── Controllers/
│   │   ├── AuthController.cs          # Login, Register, Me
│   │   ├── PersonController.cs        # Customers with roles (PersonWithRoleDto)
│   │   ├── AppointmentController.cs   # Appointments with .Include()
│   │   ├── ServiceController.cs       # Services CRUD
│   │   ├── PaymentController.cs       # Payments with Appointment info
│   │   ├── PromotionController.cs     # Promotions with Service
│   │   ├── AppointmentStatusController.cs # Enum values endpoint
│   │   ├── UserController.cs
│   │   ├── UserRoleController.cs
│   │   └── RolController.cs
│   ├── Models/
│   │   ├── Person.cs + PersonWithRoleDto
│   │   ├── Appointment.cs + AppointmentStatus enum
│   │   ├── Service.cs
│   │   ├── Payment.cs
│   │   ├── Promotion.cs
│   │   ├── User.cs + UserRole.cs
│   │   └── Rol.cs
│   ├── Data/ApplicationDbContext.cs
│   └── Migrations/
└── NailsFlow-Web/
    └── src/
        ├── api/api.js                 # Axios client (baseURL:5005)
        ├── components/                # ProtectedRoute, Sidebar
        ├── context/AuthContext.jsx     # JWT auth state
        ├── layouts/AdminLayout.jsx
        └── pages/
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── AppointmentsPage.jsx    # Dynamic dropdowns
            ├── CustomersPage.jsx       # Person with roles
            ├── ServicesPage.jsx
            ├── PromotionsPage.jsx
            └── PaymentsPage.jsx
```

## Authentication

- **Login**: `POST /api/Auth/login`
- **Register**: `POST /api/Auth/register`
- **Me**: `GET /api/Auth/me`

### Test Users
| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Administrador |
| manicurista | manicura123 | Manicurista |
| wisman | wisman123 | Administrador + Manicurista |

## C# Backend Conventions

### Naming
- Classes/Methods/Properties: PascalCase (`AppointmentController`, `GetAppointments`)
- Private fields: PascalCase with underscore (`_context`)
- Parameters/Local variables: camelCase (`appointmentId`)
- Interfaces: Prefix with `I` (`IApplicationDbContext`)

### Imports
```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailsFlow.Api.Data;
using NailsFlow.Api.Models;
```

### Types & Patterns
- Nullable reference types enabled (`<Nullable>enable</Nullable>`)
- Return `ActionResult<T>` from controllers
- Always use async/await for database operations
- Controllers inherit from `ControllerBase`
- Use DTOs for complex responses (e.g., `PersonWithRoleDto`)

### Error Handling
- Return `NotFound()` for 404
- Return `BadRequest()` for 400
- Wrap `SaveChangesAsync` in try-catch with `DbUpdateConcurrencyException`

### API Controller Pattern
```csharp
[Route("api/[controller]")]
[ApiController]
public class ExampleController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public ExampleController(ApplicationDbContext context) => _context = context;
}
```

### Entity Framework
- Use `[Column("name")]` for explicit column mapping
- Use `.Include()` and `.ThenInclude()` for related data
- Use `[ForeignKey("Id")]` for navigation properties

## React Frontend Conventions

### Naming
- Components/Files: PascalCase (`AdminLayout`, `ServicesPage.jsx`)
- Hooks: camelCase starting with `use` (`useState`, `useEffect`)
- Constants: SCREAMING_SNAKE_CASE

### Imports
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './context/AuthContext';
```

### Component Structure
- Functional components with arrow functions
- Destructure props for cleaner code
- Keep components single-purpose

### Styling
- Tailwind CSS utility classes
- Color palette: pinks, purples
- Responsive: `md:`, `lg:` prefixes
- Flex/grid for layout

### State & API
- `useState` for local state, `useEffect` for side effects
- `AuthContext` for global auth state
- Axios configured in `src/api/api.js` (baseURL: `http://localhost:5005/api`)
- JWT token included via interceptors
- Handle loading and error states

## Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/Auth/login` | POST | Login, returns JWT token |
| `/api/Person` | GET | Returns persons with roles (PersonWithRoleDto) |
| `/api/Appointment` | GET | Returns appointments with Person, Service, User |
| `/api/Service` | GET | Returns all services |
| `/api/Payment` | GET | Returns payments with Appointment data |
| `/api/Promotion` | GET | Returns promotions with TargetService |
| `/api/AppointmentStatus` | GET | Returns enum values with labels |

## AppointmentStatus Enum Values
`Requested`, `PendingAdvancePayment`, `AdvancePaymentConfirmed`, `Assigned`, `Rescheduled`, `InProgress`, `CompletedPendingPayment`, `CompletedAndConfirmed`, `Cancelled`

## Configuration

- **Backend**: `NailsFlow.Api/appsettings.json`
- **Frontend**: `NailsFlow-Web/vite.config.js`, `eslint.config.js`
- **API URL**: `http://localhost:5005`
- **Frontend URL**: `http://localhost:5173`
- **Swagger**: `/swagger` (Development mode)
- **Token**: stored in localStorage
