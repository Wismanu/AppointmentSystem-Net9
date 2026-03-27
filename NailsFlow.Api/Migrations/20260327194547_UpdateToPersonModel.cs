using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace NailsFlow.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateToPersonModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointment_person_cus_id",
                table: "appointment");

            migrationBuilder.DropColumn(
                name: "usr_phone",
                table: "user");

            migrationBuilder.RenameColumn(
                name: "cus_id",
                table: "person",
                newName: "per_id");

            migrationBuilder.RenameColumn(
                name: "cus_phone",
                table: "person",
                newName: "per_phone");

            migrationBuilder.RenameColumn(
                name: "cus_lastname",
                table: "person",
                newName: "per_lastname");

            migrationBuilder.RenameColumn(
                name: "cus_firstname",
                table: "person",
                newName: "per_firstname");

            migrationBuilder.RenameColumn(
                name: "cus_id",
                table: "appointment",
                newName: "per_id");

            migrationBuilder.RenameIndex(
                name: "IX_appointment_cus_id",
                table: "appointment",
                newName: "IX_appointment_per_id");

            migrationBuilder.AddColumn<int>(
                name: "per_id",
                table: "user",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "per_birthdate",
                table: "person",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "per_email",
                table: "person",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.InsertData(
                table: "person",
                columns: new[] { "per_id", "per_birthdate", "per_email", "per_firstname", "per_lastname", "per_phone" },
                values: new object[,]
                {
                    { 1, null, null, "Admin", "Principal", "3001234567" },
                    { 2, null, null, "Manicurista", "Prueba", "3001234568" },
                    { 3, null, null, "Wisman", "Admin", "3001234569" }
                });

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 1,
                columns: new[] { "per_id", "usr_pass" },
                values: new object[] { 1, "$2a$11$kqe/GYc5Z/STt56HmVYWougKXNzZdlf.v2DdkO3uVTkJB8TMxn7iy" });

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 2,
                columns: new[] { "per_id", "usr_pass" },
                values: new object[] { 2, "$2a$11$kVAByIhrsyioF8gLXneED.Vnvd30U3oqFjGMFd.BL5pYd6iCrz/um" });

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 3,
                columns: new[] { "per_id", "usr_pass" },
                values: new object[] { 3, "$2a$11$v5yrEwwkNZg0Uturmy3B9eGFU4lexcMH71c.I2KWw4jXfBzfNg3su" });

            migrationBuilder.CreateIndex(
                name: "IX_user_per_id",
                table: "user",
                column: "per_id",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_appointment_person_per_id",
                table: "appointment",
                column: "per_id",
                principalTable: "person",
                principalColumn: "per_id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_user_person_per_id",
                table: "user",
                column: "per_id",
                principalTable: "person",
                principalColumn: "per_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointment_person_per_id",
                table: "appointment");

            migrationBuilder.DropForeignKey(
                name: "FK_user_person_per_id",
                table: "user");

            migrationBuilder.DropIndex(
                name: "IX_user_per_id",
                table: "user");

            migrationBuilder.DeleteData(
                table: "person",
                keyColumn: "per_id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "person",
                keyColumn: "per_id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "person",
                keyColumn: "per_id",
                keyValue: 3);

            migrationBuilder.DropColumn(
                name: "per_id",
                table: "user");

            migrationBuilder.DropColumn(
                name: "per_birthdate",
                table: "person");

            migrationBuilder.DropColumn(
                name: "per_email",
                table: "person");

            migrationBuilder.RenameColumn(
                name: "per_id",
                table: "person",
                newName: "cus_id");

            migrationBuilder.RenameColumn(
                name: "per_phone",
                table: "person",
                newName: "cus_phone");

            migrationBuilder.RenameColumn(
                name: "per_lastname",
                table: "person",
                newName: "cus_lastname");

            migrationBuilder.RenameColumn(
                name: "per_firstname",
                table: "person",
                newName: "cus_firstname");

            migrationBuilder.RenameColumn(
                name: "per_id",
                table: "appointment",
                newName: "cus_id");

            migrationBuilder.RenameIndex(
                name: "IX_appointment_per_id",
                table: "appointment",
                newName: "IX_appointment_cus_id");

            migrationBuilder.AddColumn<string>(
                name: "usr_phone",
                table: "user",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 1,
                columns: new[] { "usr_pass", "usr_phone" },
                values: new object[] { "$2a$11$lSHfeDdLZQ4QAW12KT4uouCNRzqerafgHFs53YBwpZB63f3qzu.6S", "3001234567" });

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 2,
                columns: new[] { "usr_pass", "usr_phone" },
                values: new object[] { "$2a$11$eba9m3m7O5g9uf7M4eJOzOOSKf2j2glfiNFC9iAbHo/bLziOWvW4u", "3001234568" });

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 3,
                columns: new[] { "usr_pass", "usr_phone" },
                values: new object[] { "$2a$11$uqJoY5JVwN9BJwxrydtIEubyiL7Eq/nc26L.CNuVXtVBQ2IK2O9bq", "3001234569" });

            migrationBuilder.AddForeignKey(
                name: "FK_appointment_person_cus_id",
                table: "appointment",
                column: "cus_id",
                principalTable: "person",
                principalColumn: "cus_id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
