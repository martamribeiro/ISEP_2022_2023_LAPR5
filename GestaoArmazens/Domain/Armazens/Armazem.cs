using System;
using GestaoArmazens.Domain.Shared;

namespace GestaoArmazens.Domain.Armazens
{
    public class Armazem : Entity<ArmazemId>, IAggregateRoot
    {
        public string Designacao { get;  private set; }

        public Morada Morada { get;  private set; }
        public Coordenadas Coordenadas { get; private set; }

        public bool Active{ get;  private set; }

        private Armazem()
        {
            this.Active = true;
        }

        public Armazem(string id, string designacao, Morada morada, Coordenadas coordenadas)
        {
            if(id.Length<=0 || id.Length >3)    
                throw new BusinessRuleValidationException("O Armazém tem de ter um Identificador obrigatório com, no máximo, 3 caracteres.");

            if (designacao.Length >50 || designacao.Length<=0)
                throw new BusinessRuleValidationException("O Armazém tem de ter uma designação obrigatória com, no máximo, 50 caracteres.");
    
            this.Id = new ArmazemId(id);
            this.Designacao = designacao;
            this.Morada = morada;
            this.Coordenadas = coordenadas;
            this.Active = true;
        }

        public void ChangeDesignacao(string designacao)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("Não é possivel alterar a designação de um Armazém que não está ativo.");
            if (designacao.Length >50 || designacao.Length<=0)
                throw new BusinessRuleValidationException("O Armazém tem de ter uma designação obrigatória com, no máximo, 50 caracteres.");
            this.Designacao = designacao;
        }

        public void ChangeMorada(Morada morada)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("Não é possivel alterar a morada de um Armazém que não está ativo.");
            this.Morada = morada;
        }

        public void ChangeCoordenadas(Coordenadas coordenadas) 
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("Não é possivel alterar as coordendas geográficas de um Armazém que não está ativo.");
            this.Coordenadas = coordenadas;
        }
        
        public void MarkAsInative()
        {
            if(this.Active){
                this.Active = false;
            }else {
                this.Active = true;
            }
        }
    }
}