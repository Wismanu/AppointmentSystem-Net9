using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace NailsFlow.Api.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "rol",
                columns: new[] { "rol_id", "rol_descripcion", "rol_name" },
                values: new object[] { 3, "Usuario cliente del salón", "Cliente" });

            migrationBuilder.InsertData(
                table: "user",
                columns: new[] { "usr_id", "usr_name", "usr_pass", "usr_phone" },
                values: new object[,]
                {
                    { 1, "admin", "$2a$11$ZRs1sRIszokJeM0AlFd4Eu.8rv5dfa1y0fktTnB41q/2oS562SHBa", "3001234567" },
                    { 2, "manicurista", "$2a$11$Aw/dTcJ8RYQ7D9aRH8iqf.pT5yB9XW3cAmMOMcWoXGWX/vkJJZKbW", "3001234568" },
                    { 3, "wisman", "$2a$11$tOfeJZAU4tUKoyv2hJGjeOKAwVCdtTMXW4urhYIXqpyaBhSQgYiSa", "3001234569" }
                });

            migrationBuilder.InsertData(
                table: "user_role",
                columns: new[] { "ur_id", "rol_id", "usr_id" },
                values: new object[,]
                {
                    { 1, 1, 1 },
                    { 2, 2, 2 },
                    { 3, 1, 3 },
                    { 4, 2, 3 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "rol",
                keyColumn: "rol_id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "user_role",
                keyColumn: "ur_id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "user_role",
                keyColumn: "ur_id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "user_role",
                keyColumn: "ur_id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "user_role",
                keyColumn: "ur_id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 3);
        }
    }
}
