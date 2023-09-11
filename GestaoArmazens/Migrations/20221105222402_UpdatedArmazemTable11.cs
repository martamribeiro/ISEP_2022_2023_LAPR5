using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    public partial class UpdatedArmazemTable11 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DesignacaoArmazem_DesignacaoArmazem",
                table: "Armazens",
                newName: "Designacao");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Designacao",
                table: "Armazens",
                newName: "DesignacaoArmazem_DesignacaoArmazem");
        }
    }
}
