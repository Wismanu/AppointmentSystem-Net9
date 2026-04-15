using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NailsFlow.Api.Migrations
{
    /// <inheritdoc />
    public partial class refactorcodee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "is_approved",
                table: "payment",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 1,
                column: "usr_pass",
                value: "$2a$11$0bKHKirOLF5E1aoLuNRoBeB2AAQi8fQ2sgVi7zJP.sZPCMzgYG2Yy");

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 2,
                column: "usr_pass",
                value: "$2a$11$X0gLGIqX55fA.p8J6hL./uuV.ofpvhqrnu2xvtYwJyYxW44J1k8z.");

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 3,
                column: "usr_pass",
                value: "$2a$11$tf2EYYVueeq.2gqhfnefU.1oaQL2pWmIIQTsXF9p3jD2I3Yt2U9wS");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_approved",
                table: "payment");

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
    }
}
