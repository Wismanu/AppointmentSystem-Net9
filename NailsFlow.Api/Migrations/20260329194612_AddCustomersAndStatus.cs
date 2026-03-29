using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace NailsFlow.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCustomersAndStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointment_person_personPerId",
                table: "appointment");

            migrationBuilder.DropIndex(
                name: "IX_appointment_personPerId",
                table: "appointment");

            migrationBuilder.DropColumn(
                name: "personPerId",
                table: "appointment");

            migrationBuilder.InsertData(
                table: "person",
                columns: new[] { "per_id", "per_birthdate", "per_email", "per_firstname", "per_lastname", "per_phone" },
                values: new object[,]
                {
                    { 4, null, "maria@email.com", "María", "García", "3101234567" },
                    { 5, null, "carolina@email.com", "Carolina", "López", "3112345678" },
                    { 6, null, "andrea@email.com", "Andrea", "Martínez", "3123456789" },
                    { 7, null, "valentina@email.com", "Valentina", "Rodríguez", "3134567890" },
                    { 8, null, "isabella@email.com", "Isabella", "Hernández", "3145678901" }
                });

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 1,
                column: "usr_pass",
                value: "$2a$11$R9yCHdb4f4KJECmHGJfDS.4tfNAFN7ps7SXqIu26lkyTI2c/DE7Iq");

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 2,
                column: "usr_pass",
                value: "$2a$11$kUPZe7iVoyc/U/NXQJ7IyeoLWNO/jwI7PH35yrIvgMmBBw6ZJaamy");

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 3,
                column: "usr_pass",
                value: "$2a$11$Ygga1dx/i6.Vk6AsRiyKSOvK7HEMVY48ZiUyXLXUbEmOUz2OzJtAO");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "person",
                keyColumn: "per_id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "person",
                keyColumn: "per_id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "person",
                keyColumn: "per_id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "person",
                keyColumn: "per_id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "person",
                keyColumn: "per_id",
                keyValue: 8);

            migrationBuilder.AddColumn<int>(
                name: "personPerId",
                table: "appointment",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 1,
                column: "usr_pass",
                value: "$2a$11$kqe/GYc5Z/STt56HmVYWougKXNzZdlf.v2DdkO3uVTkJB8TMxn7iy");

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 2,
                column: "usr_pass",
                value: "$2a$11$kVAByIhrsyioF8gLXneED.Vnvd30U3oqFjGMFd.BL5pYd6iCrz/um");

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 3,
                column: "usr_pass",
                value: "$2a$11$v5yrEwwkNZg0Uturmy3B9eGFU4lexcMH71c.I2KWw4jXfBzfNg3su");

            migrationBuilder.CreateIndex(
                name: "IX_appointment_personPerId",
                table: "appointment",
                column: "personPerId");

            migrationBuilder.AddForeignKey(
                name: "FK_appointment_person_personPerId",
                table: "appointment",
                column: "personPerId",
                principalTable: "person",
                principalColumn: "per_id");
        }
    }
}
