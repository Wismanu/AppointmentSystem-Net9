using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NailsFlow.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePersonWithRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 1,
                column: "usr_pass",
                value: "$2a$11$7hiKCHyU8DJKJeb7iPABL.56m944F0k3ReJ5qS.fRVs4nivNfogjy");

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 2,
                column: "usr_pass",
                value: "$2a$11$haoC08Dwav1amdW1b1UAt.ECLGjx0D6X6AfFTMpT/e79yDvACbmkS");

            migrationBuilder.UpdateData(
                table: "user",
                keyColumn: "usr_id",
                keyValue: 3,
                column: "usr_pass",
                value: "$2a$11$K/5CDctRK8aWgfVGLiWUyeyE5XKdBWMtcCX4S2T8jkgkEoWGejlIq");
        }
    }
}
