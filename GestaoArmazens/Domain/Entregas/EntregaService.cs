using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using GestaoArmazens.Domain.Shared;
using GestaoArmazens.Domain.Armazens;

namespace GestaoArmazens.Domain.Entregas
{
    public class EntregaService  : IEntregaService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEntregaRepository _repo;


        public EntregaService(IUnitOfWork unitOfWork, IEntregaRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<List<EntregaDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync(); //lista de objetos Entrega
            
            //converter Entrega para EntregaDto
            List<EntregaDto> listDto = list.ConvertAll<EntregaDto>(entr => 
                new EntregaDto(entr.Id.AsGuid(),entr.IdArmazem,entr.DataEntrega,entr.Peso,entr.TempoCarregamento,entr.TempoDescarregamento)); 

            return listDto;
        }

        public async Task<List<EntregaDto>> GetAllDataAscendenteAsync()
        {
            var list = await this._repo.GetAllAsync(); //lista de objetos Entrega
            var list2 = new List<Entrega>();

            foreach (var item in list)
            {
                if(list2.Count==0){
                    list2.Add(item);
                } else {
                    for (int i = 0; i < list2.Count; i++)
                    {
                        if(Int32.Parse(item.DataEntrega)<Int32.Parse(list2[i].DataEntrega))
                        {
                            list2.Insert(i,item);
                            break;
                        }
                        if(i==list2.Count-1)
                        {
                            list2.Add(item);
                            break;
                        }
                    }
                }
            }

            //converter Entrega para EntregaDto
            List<EntregaDto> listDto = list2.ConvertAll<EntregaDto>(entr => 
                new EntregaDto(entr.Id.AsGuid(),entr.IdArmazem,entr.DataEntrega,entr.Peso,entr.TempoCarregamento,entr.TempoDescarregamento)); 

            return listDto;
        }

        public async Task<List<EntregaDto>> GetAllIdArmazemAscendenteAsync()
        {
            var list = await this._repo.GetAllAsync(); //lista de objetos Entrega
            var list2 = new List<Entrega>();

            foreach (var item in list)
            {
                if(list2.Count==0){
                    list2.Add(item);
                } else {
                    for (int i = 0; i < list2.Count; i++)
                    {
                        if(Int32.Parse(item.IdArmazem.AsString())<Int32.Parse(list2[i].IdArmazem.AsString()))
                        {
                            list2.Insert(i,item);
                            break;
                        }
                        if(i==list2.Count-1)
                        {
                            list2.Add(item);
                            break;
                        }
                    }
                }
            }

            //converter Entrega para EntregaDto
            List<EntregaDto> listDto = list2.ConvertAll<EntregaDto>(entr => 
                new EntregaDto(entr.Id.AsGuid(),entr.IdArmazem,entr.DataEntrega,entr.Peso,entr.TempoCarregamento,entr.TempoDescarregamento)); 

            return listDto;
        }

        public async Task<EntregaDto> GetByIdAsync(EntregaId id)
        {
            var entr = await this._repo.GetByIdAsync(id);
            
            if(entr == null)
                return null;

            return new EntregaDto(entr.Id.AsGuid(),entr.IdArmazem,entr.DataEntrega,entr.Peso,entr.TempoCarregamento,entr.TempoDescarregamento); 
        }

        public async Task<List<EntregaDto>> GetByIdArmazemAsync(ArmazemId id)
        {

            var list = await this._repo.GetAllAsync();
            var list2 = new List<Entrega>();

            foreach (var item in list)
            {
                if(item.IdArmazem==id){
                    list2.Add(item);
                }
            }

            List<EntregaDto> listDto = list2.ConvertAll<EntregaDto>(entr => 
                new EntregaDto(entr.Id.AsGuid(),entr.IdArmazem,entr.DataEntrega,entr.Peso,entr.TempoCarregamento,entr.TempoDescarregamento)); 

            return listDto;
        }

        public async Task<List<EntregaDto>> GetByIdArmazemDataAscendenteAsync(ArmazemId id)
        {
            var list = await this._repo.GetAllAsync();
            var list2 = new List<Entrega>();
            var list3 = new List<Entrega>();

            foreach (var item in list)
            {
                if(item.IdArmazem==id){
                    list3.Add(item);
                }
            }

            foreach (var item in list3)
            {
                if(list2.Count==0){
                    list2.Add(item);
                } else {
                    for (int i = 0; i < list2.Count; i++)
                    {
                        if(Int32.Parse(item.DataEntrega)<Int32.Parse(list2[i].DataEntrega))
                        {
                            list2.Insert(i,item);
                            break;
                        }
                        if(i==list2.Count-1)
                        {
                            list2.Add(item);
                            break;
                        }
                    }
                }
            }

            //converter Entrega para EntregaDto
            List<EntregaDto> listDto = list2.ConvertAll<EntregaDto>(entr => 
                new EntregaDto(entr.Id.AsGuid(),entr.IdArmazem,entr.DataEntrega,entr.Peso,entr.TempoCarregamento,entr.TempoDescarregamento)); 

            return listDto;
        }

        public async Task<List<EntregaDto>> GetByDatasAsync(string date1, string date2)
        {

            var list = await this._repo.GetAllAsync();
            var list2 = new List<Entrega>();

            int n, m;

            foreach (var item in list)
            {
                if(int.TryParse(date1, out n) && int.TryParse(date2, out m)){
                    if(Int32.Parse(item.DataEntrega)>=Int32.Parse(date1) && Int32.Parse(item.DataEntrega)<=Int32.Parse(date2)){
                        list2.Add(item);
                    }
                }
                
            }

            List<EntregaDto> listDto = list2.ConvertAll<EntregaDto>(entr => 
                new EntregaDto(entr.Id.AsGuid(),entr.IdArmazem,entr.DataEntrega,entr.Peso,entr.TempoCarregamento,entr.TempoDescarregamento)); 

            return listDto;
        }

        public async Task<List<EntregaDto>> GetByDatasDataAscendenteAsync(string date1, string date2)
        {
            var list = await this._repo.GetAllAsync(); //lista de objetos Entrega
            var list2 = new List<Entrega>();
            var list3 = new List<Entrega>();

            int n, m;

            foreach (var item in list)
            {
                if(int.TryParse(date1, out n) && int.TryParse(date2, out m)){
                    if(Int32.Parse(item.DataEntrega)>=Int32.Parse(date1) && Int32.Parse(item.DataEntrega)<=Int32.Parse(date2)){
                        list3.Add(item);
                    }
                }
                
            }

            foreach (var item in list3)
            {
                if(list2.Count==0){
                    list2.Add(item);
                } else {
                    for (int i = 0; i < list2.Count; i++)
                    {
                        if(Int32.Parse(item.DataEntrega)<Int32.Parse(list2[i].DataEntrega))
                        {
                            list2.Insert(i,item);
                            break;
                        }
                        if(i==list2.Count-1)
                        {
                            list2.Add(item);
                            break;
                        }
                    }
                }
            }

            //converter Entrega para EntregaDto
            List<EntregaDto> listDto = list2.ConvertAll<EntregaDto>(entr => 
                new EntregaDto(entr.Id.AsGuid(),entr.IdArmazem,entr.DataEntrega,entr.Peso,entr.TempoCarregamento,entr.TempoDescarregamento)); 

            return listDto;
        }

        public async Task<List<EntregaDto>> GetByDatasIdArmazemAscendenteAsync(string date1, string date2)
        {
            var list = await this._repo.GetAllAsync(); //lista de objetos Entrega
            var list2 = new List<Entrega>();
            var list3 = new List<Entrega>();

            int n, m;

            foreach (var item in list)
            {
                if(int.TryParse(date1, out n) && int.TryParse(date2, out m)){
                    if(Int32.Parse(item.DataEntrega)>=Int32.Parse(date1) && Int32.Parse(item.DataEntrega)<=Int32.Parse(date2)){
                        list3.Add(item);
                    }
                }
                
            }

            foreach (var item in list3)
            {
                if(list2.Count==0){
                    list2.Add(item);
                } else {
                    for (int i = 0; i < list2.Count; i++)
                    {
                        if(Int32.Parse(item.IdArmazem.AsString())<Int32.Parse(list2[i].IdArmazem.AsString()))
                        {
                            list2.Insert(i,item);
                            break;
                        }
                        if(i==list2.Count-1)
                        {
                            list2.Add(item);
                            break;
                        }
                    }
                }
            }

            //converter Entrega para EntregaDto
            List<EntregaDto> listDto = list2.ConvertAll<EntregaDto>(entr => 
                new EntregaDto(entr.Id.AsGuid(),entr.IdArmazem,entr.DataEntrega,entr.Peso,entr.TempoCarregamento,entr.TempoDescarregamento)); 

            return listDto;
        }

        public async Task<List<EntregaDto>> GetByIdArmazemEDatasAsync(ArmazemId id, string date1, string date2)
        {

            var list = await this._repo.GetAllAsync();
            var list2 = new List<Entrega>();
            var list3 = new List<Entrega>();

            int n, m;

            foreach (var item in list)
            {
                if(item.IdArmazem==id){
                    list3.Add(item);
                }
            }

            foreach (var item in list3)
            {
                if(int.TryParse(date1, out n) && int.TryParse(date2, out m)){
                    if(Int32.Parse(item.DataEntrega)>=Int32.Parse(date1) && Int32.Parse(item.DataEntrega)<=Int32.Parse(date2)){
                        list2.Add(item);
                    }
                }
            }

            List<EntregaDto> listDto = list2.ConvertAll<EntregaDto>(entr => 
                new EntregaDto(entr.Id.AsGuid(),entr.IdArmazem,entr.DataEntrega,entr.Peso,entr.TempoCarregamento,entr.TempoDescarregamento)); 

            return listDto;
        }

        public async Task<List<EntregaDto>> GetByIdArmazemEDatasDataAscendenteAsync(ArmazemId id, string date1, string date2)
        {

            var list = await this._repo.GetAllAsync();
            var list2 = new List<Entrega>();
            var list3 = new List<Entrega>();
            var list4 = new List<Entrega>();

            int n, m;

            foreach (var item in list)
            {
                if(item.IdArmazem==id){
                    list3.Add(item);
                }
            }

            foreach (var item in list3)
            {
                if(int.TryParse(date1, out n) && int.TryParse(date2, out m)){
                    if(Int32.Parse(item.DataEntrega)>=Int32.Parse(date1) && Int32.Parse(item.DataEntrega)<=Int32.Parse(date2)){
                        list4.Add(item);
                    }
                }
            }

            foreach (var item in list4)
            {
                if(list2.Count==0){
                    list2.Add(item);
                } else {
                    for (int i = 0; i < list2.Count; i++)
                    {
                        if(Int32.Parse(item.DataEntrega)<Int32.Parse(list2[i].DataEntrega))
                        {
                            list2.Insert(i,item);
                            break;
                        }
                        if(i==list2.Count-1)
                        {
                            list2.Add(item);
                            break;
                        }
                    }
                }
            }

            List<EntregaDto> listDto = list2.ConvertAll<EntregaDto>(entr => 
                new EntregaDto(entr.Id.AsGuid(),entr.IdArmazem,entr.DataEntrega,entr.Peso,entr.TempoCarregamento,entr.TempoDescarregamento)); 

            return listDto;
        }

        public async Task<List<EntregaDto>> GetByIdArmazemEDatasIdArmazemAscendenteAsync(ArmazemId id, string date1, string date2)
        {

            var list = await this._repo.GetAllAsync();
            var list2 = new List<Entrega>();
            var list3 = new List<Entrega>();
            var list4 = new List<Entrega>();

            int n, m;

            foreach (var item in list)
            {
                if(item.IdArmazem==id){
                    list3.Add(item);
                }
            }

            foreach (var item in list3)
            {
                if(int.TryParse(date1, out n) && int.TryParse(date2, out m)){
                    if(Int32.Parse(item.DataEntrega)>=Int32.Parse(date1) && Int32.Parse(item.DataEntrega)<=Int32.Parse(date2)){
                        list4.Add(item);
                    }
                }
            }

            foreach (var item in list4)
            {
                if(list2.Count==0){
                    list2.Add(item);
                } else {
                    for (int i = 0; i < list2.Count; i++)
                    {
                        if(Int32.Parse(item.IdArmazem.AsString())<Int32.Parse(list2[i].IdArmazem.AsString()))
                        {
                            list2.Insert(i,item);
                            break;
                        }
                        if(i==list2.Count-1)
                        {
                            list2.Add(item);
                            break;
                        }
                    }
                }
            }

            List<EntregaDto> listDto = list2.ConvertAll<EntregaDto>(entr => 
                new EntregaDto(entr.Id.AsGuid(),entr.IdArmazem,entr.DataEntrega,entr.Peso,entr.TempoCarregamento,entr.TempoDescarregamento)); 

            return listDto;
        }

        public async Task<EntregaDto> AddAsync(EntregaDto dto)
        {
            var entrega = new Entrega(dto.IdArmazem,dto.DataEntrega,dto.Peso, dto.TempoCarregamento, dto.TempoDescarregamento);

            await this._repo.AddAsync(entrega);

            await this._unitOfWork.CommitAsync();

            return new EntregaDto(entrega.Id.AsGuid(),entrega.IdArmazem,entrega.DataEntrega,entrega.Peso,entrega.TempoCarregamento,entrega.TempoDescarregamento);
        }

        public async Task<EntregaDto> UpdateAsync(EntregaDto dto)
        {
            var entrega = await this._repo.GetByIdAsync(new EntregaId(dto.Id)); 

            if (entrega == null)
                return null;   

            // change all fields
            entrega.ChangeIdArmazem(dto.IdArmazem);
            entrega.ChangeDataEntrega(dto.DataEntrega);
            entrega.ChangePeso(dto.Peso);
            entrega.ChangeTempoCarregamento(dto.TempoCarregamento);
            entrega.ChangeTempoDescarregamento(dto.TempoDescarregamento);
            
            await this._unitOfWork.CommitAsync();

            return new EntregaDto(entrega.Id.AsGuid(),entrega.IdArmazem,entrega.DataEntrega,entrega.Peso,entrega.TempoCarregamento,entrega.TempoDescarregamento);
        }

        public async Task<EntregaDto> InactivateAsync(EntregaId id)
        {
            var entrega = await this._repo.GetByIdAsync(id); 

            if (entrega == null)
                return null;   

            entrega.MarkAsInative();
            
            await this._unitOfWork.CommitAsync();

            return new EntregaDto(entrega.Id.AsGuid(),entrega.IdArmazem,entrega.DataEntrega,entrega.Peso,entrega.TempoCarregamento,entrega.TempoDescarregamento);
        }

        public async Task<EntregaDto> DeleteAsync(EntregaId id)
        {
            var entrega = await this._repo.GetByIdAsync(id); 

            if (entrega == null)
                return null;   

            if (entrega.Active)
                throw new BusinessRuleValidationException("Não é possivel apagar uma Entrega inativa.");
            
            this._repo.Remove(entrega);
            await this._unitOfWork.CommitAsync();

            return new EntregaDto(entrega.Id.AsGuid(),entrega.IdArmazem,entrega.DataEntrega,entrega.Peso,entrega.TempoCarregamento,entrega.TempoDescarregamento);
        }
    }
}