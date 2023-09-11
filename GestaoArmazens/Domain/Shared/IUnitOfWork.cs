using System.Threading.Tasks;

namespace GestaoArmazens.Domain.Shared
{
    public interface IUnitOfWork
    {
        Task<int> CommitAsync();
    }
}