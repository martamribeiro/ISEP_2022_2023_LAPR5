using System;
using GestaoArmazens.Domain.Shared;

namespace GestaoArmazens.Domain.Armazens
{
    public class ArmazemDto
    {
        public string Id { get; set; }
        public string Designcacao { get;  set; }
        public Morada Morada { get; set; }
        public Coordenadas Coordenadas { get; set; }

        public bool Active{ get;  set; }

        public ArmazemDto(string Id, string designacao, Morada morada, Coordenadas coordenadas, bool active)
        {
            if (designacao?.Length >50 || designacao?.Length<=0)
                throw new BusinessRuleValidationException("O Armazém tem de ter uma designação obrigatória com, no máximo, 50 caracteres.");
    
            this.Id = Id;
            this.Designcacao = designacao;
            this.Morada = morada;
            this.Coordenadas = coordenadas;
            this.Active = active;
        }
    }
}