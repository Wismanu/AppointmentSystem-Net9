using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NailsFlow.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialNailsDesign : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "person",
                columns: table => new
                {
                    cus_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    cus_firstname = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    cus_lastname = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    cus_phone = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_person", x => x.cus_id);
                });

            migrationBuilder.CreateTable(
                name: "rol",
                columns: table => new
                {
                    rol_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    rol_name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    rol_descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_rol", x => x.rol_id);
                });

            migrationBuilder.CreateTable(
                name: "service",
                columns: table => new
                {
                    ser_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ser_name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ser_price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ser_duration = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_service", x => x.ser_id);
                });

            migrationBuilder.CreateTable(
                name: "user",
                columns: table => new
                {
                    usr_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    rol_id = table.Column<int>(type: "int", nullable: false),
                    usr_name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    usr_phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    usr_pass = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user", x => x.usr_id);
                    table.ForeignKey(
                        name: "FK_user_rol_rol_id",
                        column: x => x.rol_id,
                        principalTable: "rol",
                        principalColumn: "rol_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "appointment",
                columns: table => new
                {
                    appoint_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    appoint_datetime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    appoint_status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    cus_id = table.Column<int>(type: "int", nullable: false),
                    ser_id = table.Column<int>(type: "int", nullable: false),
                    usr_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_appointment", x => x.appoint_id);
                    table.ForeignKey(
                        name: "FK_appointment_person_cus_id",
                        column: x => x.cus_id,
                        principalTable: "person",
                        principalColumn: "cus_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_appointment_service_ser_id",
                        column: x => x.ser_id,
                        principalTable: "service",
                        principalColumn: "ser_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_appointment_user_usr_id",
                        column: x => x.usr_id,
                        principalTable: "user",
                        principalColumn: "usr_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "payment",
                columns: table => new
                {
                    pay_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    appoint_id = table.Column<int>(type: "int", nullable: false),
                    pay_amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    pay_date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_payment", x => x.pay_id);
                    table.ForeignKey(
                        name: "FK_payment_appointment_appoint_id",
                        column: x => x.appoint_id,
                        principalTable: "appointment",
                        principalColumn: "appoint_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_appointment_cus_id",
                table: "appointment",
                column: "cus_id");

            migrationBuilder.CreateIndex(
                name: "IX_appointment_ser_id",
                table: "appointment",
                column: "ser_id");

            migrationBuilder.CreateIndex(
                name: "IX_appointment_usr_id",
                table: "appointment",
                column: "usr_id");

            migrationBuilder.CreateIndex(
                name: "IX_payment_appoint_id",
                table: "payment",
                column: "appoint_id");

            migrationBuilder.CreateIndex(
                name: "IX_user_rol_id",
                table: "user",
                column: "rol_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "payment");

            migrationBuilder.DropTable(
                name: "appointment");

            migrationBuilder.DropTable(
                name: "person");

            migrationBuilder.DropTable(
                name: "service");

            migrationBuilder.DropTable(
                name: "user");

            migrationBuilder.DropTable(
                name: "rol");
        }
    }
}
