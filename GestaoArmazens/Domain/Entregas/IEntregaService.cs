using System.Threading.Tasks;
using System.Collections.Generic;
using GestaoArmazens.Domain.Shared;
using GestaoArmazens.Domain.Armazens;

namespace GestaoArmazens.Domain.Entregas
{
    public interface IEntregaService
    {
        Task<List<EntregaDto>> GetAllAsync();
        Task<List<EntregaDto>> GetAllDataAscendenteAsync(); //comentado no controller
        Task<List<EntregaDto>> GetAllIdArmazemAscendenteAsync(); //comentado no controller
        Task<EntregaDto> GetByIdAsync(EntregaId id);
        Task<List<EntregaDto>> GetByIdArmazemAsync(ArmazemId id);
        Task<List<EntregaDto>> GetByIdArmazemDataAscendenteAsync(ArmazemId id);
        Task<List<EntregaDto>> GetByDatasAsync(string date1, string date2);
        Task<List<EntregaDto>> GetByDatasDataAscendenteAsync(string date1, string date2);
        Task<List<EntregaDto>> GetByDatasIdArmazemAscendenteAsync(string date1, string date2);
        Task<List<EntregaDto>> GetByIdArmazemEDatasAsync(ArmazemId id, string date1, string date2);
        Task<List<EntregaDto>> GetByIdArmazemEDatasDataAscendenteAsync(ArmazemId id, string date1, string date2);
        Task<List<EntregaDto>> GetByIdArmazemEDatasIdArmazemAscendenteAsync(ArmazemId id, string date1, string date2);
        Task<EntregaDto> AddAsync(EntregaDto dto);
        Task<EntregaDto> UpdateAsync(EntregaDto dto);
        Task<EntregaDto> InactivateAsync(EntregaId id);
        Task<EntregaDto> DeleteAsync(EntregaId id);
    }
}