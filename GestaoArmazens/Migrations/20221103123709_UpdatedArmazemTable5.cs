using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    public partial class UpdatedArmazemTable5 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Longitude",
                table: "Armazens",
                newName: "Coordenadas_Longitude");

            migrationBuilder.RenameColumn(
                name: "Latitude",
                table: "Armazens",
                newName: "Coordenadas_Latitude");

            migrationBuilder.RenameColumn(
                name: "Altitude",
                table: "Armazens",
                newName: "Coordenadas_Altitude");

            migrationBuilder.AlterColumn<double>(
                name: "Coordenadas_Longitude",
                table: "Armazens",
                type: "double",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "double");

            migrationBuilder.AlterColumn<double>(
                name: "Coordenadas_Latitude",
                table: "Armazens",
                type: "double",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "double");

            migrationBuilder.AlterColumn<double>(
                name: "Coordenadas_Altitude",
                table: "Armazens",
                type: "double",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "double");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Coordenadas_Longitude",
                table: "Armazens",
                newName: "Longitude");

            migrationBuilder.RenameColumn(
                name: "Coordenadas_Latitude",
                table: "Armazens",
                newName: "Latitude");

            migrationBuilder.RenameColumn(
                name: "Coordenadas_Altitude",
                table: "Armazens",
                newName: "Altitude");

            migrationBuilder.AlterColumn<double>(
                name: "Longitude",
                table: "Armazens",
                type: "double",
                nullable: false,
                defaultValue: 0.0,
                oldClrType: typeof(double),
                oldType: "double",
                oldNullable: true);

            migrationBuilder.AlterColumn<double>(
                name: "Latitude",
                table: "Armazens",
                type: "double",
                nullable: false,
                defaultValue: 0.0,
                oldClrType: typeof(double),
                oldType: "double",
                oldNullable: true);

            migrationBuilder.AlterColumn<double>(
                name: "Altitude",
                table: "Armazens",
                type: "double",
                nullable: false,
                defaultValue: 0.0,
                oldClrType: typeof(double),
                oldType: "double",
                oldNullable: true);
        }
    }
}
