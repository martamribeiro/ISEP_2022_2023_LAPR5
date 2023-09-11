using System;
using GestaoArmazens.Domain.Shared;
using Newtonsoft.Json;

namespace GestaoArmazens.Domain.Armazens
{
    
    public class ArmazemId : EntityId
    {
        
        public ArmazemId(String value) : base(value)
        {
        }

        override
        protected  Object createFromString(String text){
            return text;
        }
        
        override
        public String AsString(){
            
            return (String) base.Value;
        }
        
    }
}