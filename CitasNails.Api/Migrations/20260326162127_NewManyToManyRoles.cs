using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CitasNails.Api.Migrations
{
    /// <inheritdoc />
    public partial class NewManyToManyRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_user_rol_rol_id",
                table: "user");

            migrationBuilder.DropIndex(
                name: "IX_user_rol_id",
                table: "user");

            migrationBuilder.DropColumn(
                name: "rol_id",
                table: "user");

            migrationBuilder.CreateTable(
                name: "user_role",
                columns: table => new
                {
                    ur_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    usr_id = table.Column<int>(type: "int", nullable: false),
                    rol_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_role", x => x.ur_id);
                    table.ForeignKey(
                        name: "FK_user_role_rol_rol_id",
                        column: x => x.rol_id,
                        principalTable: "rol",
                        principalColumn: "rol_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_user_role_user_usr_id",
                        column: x => x.usr_id,
                        principalTable: "user",
                        principalColumn: "usr_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_user_role_rol_id",
                table: "user_role",
                column: "rol_id");

            migrationBuilder.CreateIndex(
                name: "IX_user_role_usr_id",
                table: "user_role",
                column: "usr_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "user_role");

            migrationBuilder.AddColumn<int>(
                name: "rol_id",
                table: "user",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_user_rol_id",
                table: "user",
                column: "rol_id");

            migrationBuilder.AddForeignKey(
                name: "FK_user_rol_rol_id",
                table: "user",
                column: "rol_id",
                principalTable: "rol",
                principalColumn: "rol_id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
