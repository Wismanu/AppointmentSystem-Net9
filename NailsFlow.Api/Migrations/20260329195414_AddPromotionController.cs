using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NailsFlow.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPromotionController : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
    }
}
