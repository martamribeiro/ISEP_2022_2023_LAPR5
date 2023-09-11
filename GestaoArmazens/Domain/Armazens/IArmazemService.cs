using System.Threading.Tasks;
using System.Collections.Generic;
using GestaoArmazens.Domain.Shared;

namespace GestaoArmazens.Domain.Armazens
{
    public interface IArmazemService{
        Task<List<ArmazemDto>> GetAllAsync();
        Task<ArmazemDto> GetByIdAsync(ArmazemId id);
        Task<ArmazemDto> GetByDesignationAsync(string designacao);
        Task<ArmazemDto> AddAsync(ArmazemDto dto);
        Task<ArmazemDto> UpdateAsync(ArmazemDto dto);
        Task<ArmazemDto> InactivateAsync(ArmazemId id);
         Task<ArmazemDto> DeleteAsync(ArmazemId id);
    }
}