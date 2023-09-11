using GestaoArmazens.Domain.Shared;
using System.Collections.Generic;

namespace GestaoArmazens.Domain.Armazens
{
    public class Coordenadas : ValueObject
    {
        public double Latitude{ get;  private set; }
        public double Longitude { get; private set; }
        public double Altitude { get; private set; }


        private Coordenadas()
        {
        }

       public Coordenadas(double latitude, double longitude, double altitude)
        { 
            if(latitude <-90 || latitude > 90)
                throw new BusinessRuleValidationException("A Latitude tem de ser um valor compreendido entre -90 e 90.");
            if(longitude < -180 || longitude > 180)
                throw new BusinessRuleValidationException("A Longitude tem de ser um valor compreendido entre -180 e 180.");

            this.Latitude = latitude;
            this.Longitude = longitude;
            this.Altitude = altitude;
        }

        protected override IEnumerable<object> GetAtomicValues()
        {
            yield return Latitude;
            yield return Longitude;
            yield return Altitude;
        }
    }
}