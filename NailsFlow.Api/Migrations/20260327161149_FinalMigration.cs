using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NailsFlow.Api.Migrations
{
    /// <inheritdoc />
    public partial class FinalMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 1,
                column: "usr_pass",
                value: "$2a$11$lSHfeDdLZQ4QAW12KT4uouCNRzqerafgHFs53YBwpZB63f3qzu.6S");

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 2,
                column: "usr_pass",
                value: "$2a$11$eba9m3m7O5g9uf7M4eJOzOOSKf2j2glfiNFC9iAbHo/bLziOWvW4u");

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 3,
                column: "usr_pass",
                value: "$2a$11$uqJoY5JVwN9BJwxrydtIEubyiL7Eq/nc26L.CNuVXtVBQ2IK2O9bq");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 1,
                column: "usr_pass",
                value: "$2a$11$ZRs1sRIszokJeM0AlFd4Eu.8rv5dfa1y0fktTnB41q/2oS562SHBa");

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 2,
                column: "usr_pass",
                value: "$2a$11$Aw/dTcJ8RYQ7D9aRH8iqf.pT5yB9XW3cAmMOMcWoXGWX/vkJJZKbW");

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 3,
                column: "usr_pass",
                value: "$2a$11$tOfeJZAU4tUKoyv2hJGjeOKAwVCdtTMXW4urhYIXqpyaBhSQgYiSa");
        }
    }
}
