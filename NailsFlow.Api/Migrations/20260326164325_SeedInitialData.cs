using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace NailsFlow.Api.Migrations
{
    /// <inheritdoc />
    public partial class SeedInitialData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "rol",
                columns: new[] { "rol_id", "rol_descripcion", "rol_name" },
                values: new object[,]
                {
                    { 1, "Acceso total al sistema", "Administrador" },
                    { 2, "Gestión de citas y servicios", "Manicurista" }
                });

            migrationBuilder.InsertData(
                table: "service",
                columns: new[] { "ser_id", "ser_duration", "ser_name", "ser_price" },
                values: new object[,]
                {
                    { 1, 90, "Tradicional", 15000m },
                    { 2, 90, "Semipermanente", 25000m },
                    { 3, 150, "Dipping (Depower)", 35000m },
                    { 4, 150, "Press On", 50000m },
                    { 5, 180, "Polygel", 65000m }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "rol",
                keyColumn: "rol_id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "rol",
                keyColumn: "rol_id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "service",
                keyColumn: "ser_id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "service",
                keyColumn: "ser_id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "service",
                keyColumn: "ser_id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "service",
                keyColumn: "ser_id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "service",
                keyColumn: "ser_id",
                keyValue: 5);
        }
    }
}
