# NailsFlow - Appointment Management System

**NailsFlow** es una solución integral diseñada para la gestión profesional de salones de belleza. Este ecosistema combina una **API REST robusta** desarrollada en .NET 9 con un **Panel Administrativo moderno** en React, permitiendo el control total de citas, servicios, clientes y flujo de pagos en tiempo real.

---

## 🚀 Tech Stack

### **Backend (The Engine)**
* **Framework:** .NET 9 (C#).
* **ORM:** Entity Framework Core (Code First).
* **Database:** SQL Server con integridad referencial protegida.
* **Documentation:** Swagger / OpenAPI para pruebas de endpoints.
* **Serialization:** Soporte para referencias circulares y manejo de JSON complejo.

### **Frontend (The Interface)**
* **Library:** React 18+ (Vite).
* **Styling:** Tailwind CSS (Diseño responsivo y personalizado).
* **Routing:** React Router DOM para una navegación fluida (SPA).
* **API Client:** Axios para comunicación asíncrona con el servidor.

---

## 🛠️ Key Features

* **Admin Dashboard:** Interfaz con Sidebar dinámico y navegación por módulos (Citas, Servicios, Clientes, Promociones).
* **Gestión de Servicios:** Catálogo dinámico con precios y duraciones personalizadas.
* **Máquina de Estados de Citas:** Lógica de negocio avanzada que cubre desde la solicitud inicial hasta la confirmación de pagos y carga de vouchers.
* **Sistema de Roles N:N:** Permisos flexibles donde un usuario puede ser Administrador y Manicurista simultáneamente.
* **Promociones Inteligentes:** Reglas basadas en fidelidad (ej. descuentos tras X visitas) vinculadas a servicios específicos.

---

## 📊 Data Model

El sistema se basa en un esquema relacional sólido:
* **Customers:** Historial y contacto de clientes.
* **Services:** Definición de procedimientos y costos.
* **Appointments:** El núcleo del sistema que vincula clientes, servicios y profesionales.
* **Payments:** Registro financiero detallado de cada servicio.
* **Users & Roles:** Gestión de acceso y seguridad.

---

## 💻 Configuración y Ejecución del Proyecto

Para poner en marcha el ecosistema completo, sigue estos pasos en tu terminal:

### **1. Backend (.NET 9 API)**

Desde la carpeta `NailsFlow.Api`, ejecuta los siguientes comandos para restaurar dependencias, aplicar la base de datos e iniciar el servidor:

```bash
# Navegar a la carpeta del servidor
cd NailsFlow.Api

# Restaurar paquetes NuGet
dotnet restore

# Aplicar migraciones a SQL Server
dotnet ef database update

# Iniciar el API
dotnet run
```

## 📦Paquetes NuGet Utilizados

* **Microsoft.EntityFrameworkCore.SqlServer:** Proveedor de base de datos para SQL Server.
* **Microsoft.EntityFrameworkCore.Design / Tools:** Herramientas necesarias para la creación y gestión de migraciones.
* **Microsoft.AspNetCore.Mvc.NewtonsoftJson:** Utilizado para el manejo de JSON y resolución de referencias circulares en relaciones N:N.
* **Swashbuckle.AspNetCore:** Implementación de Swagger/OpenAPI para la documentación y prueba de los controladores.

### **2. Frontend (React + Vite)**

Desde la carpeta `NailsFlow-Web`, ejecuta los siguientes comandos para instalar los módulos de Node y levantar el entorno de desarrollo:

```bash
# Navegar a la carpeta del cliente
cd NailsFlow-Web

# Instalar dependencias de npm
npm install

# Iniciar el servidor de desarrollo
npm run dev
```
## 📦Dependencias (npm) Utilizadas

* **react-router-dom:** Motor principal para la navegación entre páginas como Dashboard, Citas, Servicios y Clientes.
* **axios:** Cliente HTTP para realizar peticiones a los controladores del Backend.
* **tailwindcss:** Framework de CSS para el diseño visual, responsivo y personalizado del panel.
* **Payments:** Registro financiero detallado de cada servicio.
* **autoprefixer / postcss:** Herramientas de post-procesamiento para garantizar la compatibilidad de estilos.
