using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NailsFlow.Api.Migrations
{
    /// <inheritdoc />
    public partial class updaaate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 1,
                column: "usr_pass",
                value: "$2a$11$kZO0.8qdSJPoGIfVOZ0MXuntasfcuVHrHBnn2fPvIPW63yVm7NDK6");

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 2,
                column: "usr_pass",
                value: "$2a$11$W3bZ3Ofjjp1ltw7cYBYATurPCkLQCoZVF5aw3QSiNr9UXqWWG2gX6");

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 3,
                column: "usr_pass",
                value: "$2a$11$WRqsy6HWfva/SM3/iD9NV.i6KdIAGKG6sB3KXVSO7capO3KxebcQK");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 1,
                column: "usr_pass",
                value: "$2a$11$COy0nIJzX0O4OxAW9Zr9he6S355.9REqRmcJSG.tovCa6k/xe7Pre");

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 2,
                column: "usr_pass",
                value: "$2a$11$lKkdaPVOuraQXsEXQSESbO3QmHmjpYklgK2eV253kU97MUBkvyvxy");

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 3,
                column: "usr_pass",
                value: "$2a$11$2c.t/neLu2m7fz8mB6S.0OlU7T1v2V9C62aaSEhNpwQQuOzvY0jjC");
        }
    }
}
