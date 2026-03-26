# AppointmentSystem-Net9
Nails Design Appointment Management System. A REST API developed with .NET 9, Entity Framework Core, and SQL Server. It features service management, customer tracking, multi-role user authorization, and a complete appointment scheduling and payment workflow.

# 💅 Nails Design - Appointment Management System API

This project is a robust **REST API** designed for the comprehensive management of a professional nail salon. It enables efficient administration of services, clients, staff, and the complete workflow from scheduling to billing.

### 🚀 Tech Stack
* **Framework:** .NET 9 (C#)
* **ORM:** Entity Framework Core (Code First)
* **Database:** SQL Server
* **Documentation:** Swagger / OpenAPI
* **Serialization:** Newtonsoft.Json (Circular reference handling)

### 🛠️ Key Features
* **N-Tier Architecture:** Clear separation between Models, Controllers, and Data Context.
* **Many-to-Many Relationship (N:N):** Flexible role implementation (a user can hold multiple roles, such as Administrator and Manicurist, simultaneously).
* **Business Logic Validations:** Referential integrity protection during the appointment booking process.
* **Seed Data:** Automated loading of service catalogs and initial system roles.
* **Full CRUD:** Comprehensive management of Clients, Services, Users, and Payments.

### 📊 Data Model
The system includes the following entities:
- **Customers:** Management of client contact information and history.
- **Services:** Catalog of procedures including pricing and average duration.
- **Users & Roles:** Permission system implemented via a junction table for many-to-many mapping.
- **Appointments:** The core of the system, linking clients, services, and professionals.
- **Payments:** Financial records for each completed appointment.
