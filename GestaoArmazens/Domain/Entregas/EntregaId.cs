using System;
using GestaoArmazens.Domain.Shared;
using Newtonsoft.Json;

namespace GestaoArmazens.Domain.Entregas
{
    
    public class EntregaId : EntityId
    {
        [JsonConstructor]
        public EntregaId(Guid value) : base(value)
        {
        }

        public EntregaId(String value) : base(value)
        {
        }

        override
        protected  Object createFromString(String text){
            return new Guid(text);
        }
        
        override
        public String AsString(){
            Guid obj = (Guid) base.ObjValue;
            return obj.ToString();
        }
        public Guid AsGuid(){
            return (Guid) base.ObjValue;
        }
    }
}