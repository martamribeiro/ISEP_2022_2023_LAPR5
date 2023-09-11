using GestaoArmazens.Domain.Entregas;
using GestaoArmazens.Infrastructure.Entregas;
using GestaoArmazens.Infrastructure.Shared;

namespace GestaoArmazens.Infrastructure.Entregas
{
    public class EntregaRepository : BaseRepository<Entrega, EntregaId>,IEntregaRepository
    {
        public EntregaRepository(MySQLContext context):base(context.Entregas)
        {
           
        }
    }
}