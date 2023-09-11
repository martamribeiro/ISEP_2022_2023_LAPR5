using GestaoArmazens.Domain.Armazens;
using GestaoArmazens.Infrastructure.Armazens;
using GestaoArmazens.Infrastructure.Shared;

namespace GestaoArmazens.Infrastructure.Armazens
{
    public class ArmazemRepository : BaseRepository<Armazem, ArmazemId>,IArmazemRepository
    {
        public ArmazemRepository(MySQLContext context):base(context.Armazens)
        {
           
        }
    }
}