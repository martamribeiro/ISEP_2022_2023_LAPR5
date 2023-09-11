using System;
using GestaoArmazens.Domain.Shared;
using GestaoArmazens.Domain.Armazens;

namespace GestaoArmazens.Domain.Entregas
{
    public class EntregaDto
    {
        public Guid Id { get; set; }
        public ArmazemId IdArmazem { get; set; }
        public String DataEntrega { get;  set; }
        public double Peso { get; set; }
        public int TempoCarregamento { get; set; }
        public int TempoDescarregamento { get; set; }


        public EntregaDto(Guid Id, ArmazemId idArmazem, String dataEntrega, double peso, int tempoCarregamento, int tempoDescarregamento)
        {
            if(idArmazem.AsString().Length<=0 || idArmazem.AsString().Length>3)
                throw new BusinessRuleValidationException("A Entrega necessita de um Id de Armazém com formatação adequada.");
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
            this.Id = Id;
            this.IdArmazem = idArmazem;
            this.DataEntrega = dataEntrega;
            this.Peso = peso;
            this.TempoCarregamento = tempoCarregamento;
            this.TempoDescarregamento = tempoDescarregamento;
        }
    }
}