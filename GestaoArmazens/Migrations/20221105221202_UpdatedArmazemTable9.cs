using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    public partial class UpdatedArmazemTable9 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Designacao",
                table: "Armazens",
                newName: "Designacao_DesignacaoArmazem");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Designacao_DesignacaoArmazem",
                table: "Armazens",
                newName: "Designacao");
        }
    }
}
