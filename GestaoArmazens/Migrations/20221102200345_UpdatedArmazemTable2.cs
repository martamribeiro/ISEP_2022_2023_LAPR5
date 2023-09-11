using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    public partial class UpdatedArmazemTable2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Morada",
                table: "Armazens",
                newName: "Morada_Rua");

            migrationBuilder.AddColumn<string>(
                name: "Morada_CodigoPostal",
                table: "Armazens",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Morada_Localidade",
                table: "Armazens",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "Morada_NumeroPorta",
                table: "Armazens",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Morada_Pais",
                table: "Armazens",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Morada_CodigoPostal",
                table: "Armazens");

            migrationBuilder.DropColumn(
                name: "Morada_Localidade",
                table: "Armazens");

            migrationBuilder.DropColumn(
                name: "Morada_NumeroPorta",
                table: "Armazens");

            migrationBuilder.DropColumn(
                name: "Morada_Pais",
                table: "Armazens");

            migrationBuilder.RenameColumn(
                name: "Morada_Rua",
                table: "Armazens",
                newName: "Morada");
        }
    }
}
