using GestaoArmazens.Domain.Shared;
using GestaoArmazens.Domain;

namespace GestaoArmazens.Domain.Armazens
{
    public interface IArmazemRepository: IRepository<Armazem,ArmazemId>
    {
    }
}