using System;
using GestaoArmazens.Domain.Shared;
using GestaoArmazens.Domain.Armazens;

namespace GestaoArmazens.Domain.Entregas
{
    public class Entrega : Entity<EntregaId>, IAggregateRoot
    {

        //private readonly IArmazemRepository repo;

        public ArmazemId IdArmazem { get; private set;}

        public String DataEntrega { get; private set; }

        public double Peso { get; private set; }

        public int TempoCarregamento { get; private set; }

        public int TempoDescarregamento { get; private set; }

        public bool Active{ get;  private set; }

        private Entrega()
        {
            this.Active = true;
        }

        public Entrega(ArmazemId idArmazem, String dataEntrega, double peso, int tempoCarregamento, int tempoDescarregamento)
        {
            /*if (idArmazem.Value.Length<=0||idArmazem.Value.Length>3)
                throw new BusinessRuleValidationException("A Entrega necessita de um Id de Armazém com formatação adequada.");
            if(repo.GetByIdAsync(idArmazem) == null)
                throw new BusinessRuleValidationException("O Id de Armazém tem de pertencer a um Armazém existente");*/
            int n;
            if (!int.TryParse(dataEntrega, out n)){
                throw new BusinessRuleValidationException("A Data de Entrega tem de ter o formato AAAAMMDD.");
            }
            Int32 date = Int32.Parse(dataEntrega);
            Int32 currentDate = Int32.Parse(DateTime.Now.ToString("yyyyMMdd"));
            if (date<currentDate)
                throw new BusinessRuleValidationException("A Entrega tem de ter data futura.");
            if (peso<=0)
                throw new BusinessRuleValidationException("O peso não pode ser nulo ou negativo.");
            if (tempoCarregamento<=0)
                throw new BusinessRuleValidationException("O tempo de carregamento tem de ser superior a 0.");
            if(tempoDescarregamento<=0)
                throw new BusinessRuleValidationException("O tempo de descarregamento tem de ser superior a 0.");
    
            this.Id = new EntregaId(Guid.NewGuid());
            this.IdArmazem = idArmazem;
            this.DataEntrega = dataEntrega;
            this.Peso = peso;
            this.TempoCarregamento = tempoCarregamento;
            this.TempoDescarregamento = tempoDescarregamento;
            this.Active = true;
        }

        public void ChangeIdArmazem(ArmazemId idArmazem)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("Não é possivel alterar o Id de Armazém de uma Entrega que não está ativa.");
            if (idArmazem.Value.Length<=0||idArmazem.Value.Length>3)
                throw new BusinessRuleValidationException("A Entrega necessita de um Id de Armazém com formatação adequada.");
            /*if(repo.GetByIdAsync(idArmazem) == null)
                throw new BusinessRuleValidationException("O Id de Armazém tem de pertencer a um Armazém existente");*/
            this.IdArmazem = idArmazem;
        }

        public void ChangeDataEntrega(String dataEntrega)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("Não é possivel alterar a data de entrega de uma Entrega que não está ativa.");
            int n;
            if (!int.TryParse(dataEntrega, out n)){
                throw new BusinessRuleValidationException("A Data de Entrega tem de ter o formato AAAAMMDD.");
            }
            Int32 date = Int32.Parse(dataEntrega);
            Int32 currentDate = Int32.Parse(DateTime.Now.ToString("yyyyMMdd"));
            if (date<currentDate)
                throw new BusinessRuleValidationException("A Entrega tem de ter data futura.");
            this.DataEntrega = dataEntrega;
        }

        public void ChangePeso(double peso)
        {
            //if (!this.Active)
            //    throw new BusinessRuleValidationException("Não é possivel alterar o peso de uma Entrega que não está ativa.");
            if (peso<=0)
                throw new BusinessRuleValidationException("O peso não pode ser nulo ou negativo.");
            this.Peso = peso;
        }

        public void ChangeTempoCarregamento(int tempoCarregamento) 
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("Não é possivel alterar o tempo de carregamento de uma Entrega que não está ativa.");
            if (tempoCarregamento<=0)
                throw new BusinessRuleValidationException("O tempo de carregamento tem de ser superior a 0.");
            this.TempoCarregamento = tempoCarregamento;
        }

        public void ChangeTempoDescarregamento(int tempoDescarregamento) 
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("Não é possivel alterar o tempo de descarregamento de uma Entrega que não está ativa.");
            if (tempoDescarregamento<=0)
                throw new BusinessRuleValidationException("O tempo de descarregamento tem de ser superior a 0.");
            this.TempoDescarregamento = tempoDescarregamento;
        }
        
        public void MarkAsInative()
        {
            this.Active = false;
        }
    }
}