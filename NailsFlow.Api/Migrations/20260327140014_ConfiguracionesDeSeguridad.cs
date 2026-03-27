using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NailsFlow.Api.Migrations
{
    /// <inheritdoc />
    public partial class ConfiguracionesDeSeguridad : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointment_person_cus_id",
                table: "appointment");

            migrationBuilder.DropForeignKey(
                name: "FK_appointment_service_ser_id",
                table: "appointment");

            migrationBuilder.DropForeignKey(
                name: "FK_Promotions_service_TargetServiceId",
                table: "Promotions");

            migrationBuilder.RenameColumn(
                name: "TargetServiceId",
                table: "Promotions",
                newName: "ser_id");

            migrationBuilder.RenameColumn(
                name: "RequiredVisits",
                table: "Promotions",
                newName: "prom_required_visits");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Promotions",
                newName: "prom_name");

            migrationBuilder.RenameColumn(
                name: "DiscountPercentage",
                table: "Promotions",
                newName: "prom_percentage");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Promotions",
                newName: "prom_description");

            migrationBuilder.RenameColumn(
                name: "PromoId",
                table: "Promotions",
                newName: "prom_id");

            migrationBuilder.RenameColumn(
                name: "IsActive",
                table: "Promotions",
                newName: "prom_status");

            migrationBuilder.RenameIndex(
                name: "IX_Promotions_TargetServiceId",
                table: "Promotions",
                newName: "IX_Promotions_ser_id");

            migrationBuilder.AlterColumn<int>(
                name: "prom_percentage",
                table: "Promotions",
                type: "int",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(5,2)");

            migrationBuilder.AlterColumn<int>(
                name: "appoint_status",
                table: "appointment",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<int>(
                name: "personPerId",
                table: "appointment",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "appoint_voucherurl",
                table: "appointment",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_appointment_personPerId",
                table: "appointment",
                column: "personPerId");

            migrationBuilder.AddForeignKey(
                name: "FK_appointment_person_personPerId",
                table: "appointment",
                column: "personPerId",
                principalTable: "person",
                principalColumn: "cus_id");

            migrationBuilder.AddForeignKey(
                name: "FK_appointment_person_cus_id",
                table: "appointment",
                column: "cus_id",
                principalTable: "person",
                principalColumn: "cus_id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_appointment_service_ser_id",
                table: "appointment",
                column: "ser_id",
                principalTable: "service",
                principalColumn: "ser_id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Promotions_service_ser_id",
                table: "Promotions",
                column: "ser_id",
                principalTable: "service",
                principalColumn: "ser_id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_appointment_person_personPerId",
                table: "appointment");

            migrationBuilder.DropForeignKey(
                name: "FK_appointment_person_cus_id",
                table: "appointment");

            migrationBuilder.DropForeignKey(
                name: "FK_appointment_service_ser_id",
                table: "appointment");

            migrationBuilder.DropForeignKey(
                name: "FK_Promotions_service_ser_id",
                table: "Promotions");

            migrationBuilder.DropIndex(
                name: "IX_appointment_personPerId",
                table: "appointment");

            migrationBuilder.DropColumn(
                name: "personPerId",
                table: "appointment");

            migrationBuilder.DropColumn(
                name: "appoint_voucherurl",
                table: "appointment");

            migrationBuilder.RenameColumn(
                name: "ser_id",
                table: "Promotions",
                newName: "TargetServiceId");

            migrationBuilder.RenameColumn(
                name: "prom_required_visits",
                table: "Promotions",
                newName: "RequiredVisits");

            migrationBuilder.RenameColumn(
                name: "prom_percentage",
                table: "Promotions",
                newName: "DiscountPercentage");

            migrationBuilder.RenameColumn(
                name: "prom_name",
                table: "Promotions",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "prom_description",
                table: "Promotions",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "prom_id",
                table: "Promotions",
                newName: "PromoId");

            migrationBuilder.RenameColumn(
                name: "prom_status",
                table: "Promotions",
                newName: "IsActive");

            migrationBuilder.RenameIndex(
                name: "IX_Promotions_ser_id",
                table: "Promotions",
                newName: "IX_Promotions_TargetServiceId");

            migrationBuilder.AlterColumn<decimal>(
                name: "DiscountPercentage",
                table: "Promotions",
                type: "decimal(5,2)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "appoint_status",
                table: "appointment",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_appointment_person_cus_id",
                table: "appointment",
                column: "cus_id",
                principalTable: "person",
                principalColumn: "cus_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_appointment_service_ser_id",
                table: "appointment",
                column: "ser_id",
                principalTable: "service",
                principalColumn: "ser_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Promotions_service_TargetServiceId",
                table: "Promotions",
                column: "TargetServiceId",
                principalTable: "service",
                principalColumn: "ser_id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
