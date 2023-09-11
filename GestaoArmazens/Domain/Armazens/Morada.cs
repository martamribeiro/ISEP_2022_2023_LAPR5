using GestaoArmazens.Domain.Shared;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace GestaoArmazens.Domain.Armazens
{
    public class Morada : ValueObject
    {
        public string Rua { get;  private set; }
        public int NumeroPorta { get; private set; }
        public string CodigoPostal{ get;  private set; }
        public string Localidade { get; private set; }
        public string Pais { get; private set; }


        private Morada()
        {
        }

       public Morada(string rua, int numeroPorta, string codigoPostal, string localidade, string Pais)
        { 
            var patternCodigoPostal = "[0-9]{4}-[0-9]{3}";
            string codigoTemp = string.Concat(codigoPostal);  //Sem esta linha considerava o regex.Match como null
            if (string.IsNullOrEmpty(codigoTemp) || !Regex.Match(codigoTemp, patternCodigoPostal).Success)
                throw new BusinessRuleValidationException("O codigo postal não segue o formato necessário (xxxx-xxx).");    
            if(string.IsNullOrEmpty(rua)||string.IsNullOrEmpty(localidade)||string.IsNullOrEmpty(Pais)||numeroPorta<0)    
                throw new BusinessRuleValidationException("Nenhum campo da Morada pode estar vazio ou ser negativo.");    

            this.Rua = rua;
            this.NumeroPorta=numeroPorta;
            this.CodigoPostal=codigoPostal;
            this.Localidade=localidade;
            this.Pais=Pais;
        }

        protected override IEnumerable<object> GetAtomicValues()
        {
            yield return Rua;
            yield return NumeroPorta;
            yield return CodigoPostal;
            yield return Localidade;
            yield return Pais;
        }
    }
}