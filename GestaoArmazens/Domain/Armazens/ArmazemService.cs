using System.Threading.Tasks;
using System.Collections.Generic;
using GestaoArmazens.Domain.Shared;

namespace GestaoArmazens.Domain.Armazens
{
    public class ArmazemService : IArmazemService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IArmazemRepository _repo;


        public ArmazemService(IUnitOfWork unitOfWork, IArmazemRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<List<ArmazemDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();
            
            List<ArmazemDto> listDto = list.ConvertAll<ArmazemDto>(arma => 
                new ArmazemDto(arma.Id.AsString(),arma.Designacao,arma.Morada,arma.Coordenadas, arma.Active)); 

            return listDto;
        }

        public async Task<ArmazemDto> GetByIdAsync(ArmazemId id)
        {
            var arma = await this._repo.GetByIdAsync(id);
            
            if(arma == null)
                return null;

            return new ArmazemDto(arma.Id.AsString(),arma.Designacao,arma.Morada,arma.Coordenadas, arma.Active); 
        }

        public async Task<ArmazemDto> GetByDesignationAsync(string designacao)
        {
            var arma = await this._repo.GetAllAsync();

            if(arma == null)
                return null;

            Armazem armazemResult=null;

            foreach(var armazem in arma)
            {
                if(armazem.Designacao.Equals(designacao))  
                    armazemResult = armazem;
            }
                
            return new ArmazemDto(armazemResult.Id.AsString(),armazemResult.Designacao,armazemResult.Morada,armazemResult.Coordenadas, armazemResult.Active);  
        }

        public async Task<ArmazemDto> AddAsync(ArmazemDto dto)
        {
            var armazem = new Armazem(dto.Id,dto.Designcacao,dto.Morada, dto.Coordenadas);

            await this._repo.AddAsync(armazem);

            await this._unitOfWork.CommitAsync();

            return new ArmazemDto(armazem.Id.AsString(),armazem.Designacao,armazem.Morada,armazem.Coordenadas, armazem.Active);
        }

        public async Task<ArmazemDto> UpdateAsync(ArmazemDto dto)
        {
            var armazem = await this._repo.GetByIdAsync(new ArmazemId(dto.Id)); 

            if (armazem == null)
                return null;   

            // change all fields
            armazem.ChangeDesignacao(dto.Designcacao);
            armazem.ChangeMorada(dto.Morada);
            armazem.ChangeCoordenadas(dto.Coordenadas);
            
            await this._unitOfWork.CommitAsync();

            return new ArmazemDto(armazem.Id.AsString(),armazem.Designacao,armazem.Morada,armazem.Coordenadas, armazem.Active);
        }

        public async Task<ArmazemDto> InactivateAsync(ArmazemId id)
        {
            var armazem = await this._repo.GetByIdAsync(id); 

            if (armazem == null)
                return null;   

            armazem.MarkAsInative();
            
            await this._unitOfWork.CommitAsync();

            return new ArmazemDto(armazem.Id.AsString(),armazem.Designacao,armazem.Morada,armazem.Coordenadas, armazem.Active);
        }

        public async Task<ArmazemDto> DeleteAsync(ArmazemId id)
        {
            var armazem = await this._repo.GetByIdAsync(id); 

            if (armazem == null)
                return null;   

            if (!armazem.Active)
                throw new BusinessRuleValidationException("Não é possivel apagar um Armazem inativo.");
            
            this._repo.Remove(armazem);
            await this._unitOfWork.CommitAsync();

            return new ArmazemDto(armazem.Id.AsString(),armazem.Designacao,armazem.Morada,armazem.Coordenadas, armazem.Active);
        }
    }
}