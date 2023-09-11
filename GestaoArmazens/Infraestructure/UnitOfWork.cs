using System.Threading.Tasks;
using GestaoArmazens.Domain.Shared;

namespace GestaoArmazens.Infrastructure
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly MySQLContext _context;

        public UnitOfWork(MySQLContext context)
        {
            this._context = context;
        }

        public async Task<int> CommitAsync()
        {
            return await this._context.SaveChangesAsync();
        }
    }
}