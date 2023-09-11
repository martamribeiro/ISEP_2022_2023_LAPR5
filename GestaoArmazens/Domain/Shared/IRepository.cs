using System.Collections.Generic;
using System.Threading.Tasks;

namespace GestaoArmazens.Domain.Shared
{
    public interface IRepository<TEntity, TEntityId>
    {
        Task<List<TEntity>> GetAllAsync();
        Task<TEntity> GetByIdAsync(TEntityId id);
        Task<List<TEntity>> GetByIdsAsync(List<TEntityId> ids);
        /*Task<TEntity> GetByDesignationAsync(string designation);*/
        Task<TEntity> AddAsync(TEntity obj);
        void Remove(TEntity obj);
    }
}