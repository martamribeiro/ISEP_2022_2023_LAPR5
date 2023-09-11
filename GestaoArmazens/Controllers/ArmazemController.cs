using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using GestaoArmazens.Domain.Shared;
using GestaoArmazens.Domain.Armazens;


namespace GestaoArmazens.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArmazemController : ControllerBase
    {
        private readonly IArmazemService _service;

        public ArmazemController(IArmazemService service)
        {
            _service = service;
        }

        // GET: api/Armazens
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ArmazemDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        // GET: api/Armazens/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ArmazemDto>> GetGetById(String id)
        {
            var arma = await _service.GetByIdAsync(new ArmazemId(id));

            if (arma == null)
            {
                return NotFound();
            }

            return arma;
        }

        [HttpGet("porDesignacao")]
        public async Task<ActionResult<ArmazemDto>> GetByDesignationAsync(String designacao)
        {
            var arma = await _service.GetByDesignationAsync(designacao);

            if (arma == null)
            {
                return NotFound();
            }

            return arma;
        }


        // POST: api/Armazens
        [HttpPost]
        public async Task<ActionResult<ArmazemDto>> Create(ArmazemDto dto)
        {
            try
            {
                var arma = await _service.AddAsync(dto);

                return CreatedAtAction(nameof(GetGetById), new { id = arma.Id }, arma);
            }
            catch(BusinessRuleValidationException ex)
            {
                return BadRequest(new {Message = ex.Message});
            }
        }

        
        // PUT: api/Armazens/5
        [HttpPut("{id}")]
        public async Task<ActionResult<ArmazemDto>> Update(String id, ArmazemDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }

            try
            {
                var arma = await _service.UpdateAsync(dto);
                
                if (arma == null)
                {
                    return NotFound();
                }
                return Ok(arma);
            }
            catch(BusinessRuleValidationException ex)
            {
                return BadRequest(new {Message = ex.Message});
            }
        }

        // Inactivate: api/Armazens/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ArmazemDto>> SoftDelete(String id)
        {
            var arma = await _service.InactivateAsync(new ArmazemId(id));

            if (arma == null)
            {
                return NotFound();
            }

            return Ok(arma);
        }
        
        // DELETE: api/Armazens/5
        [HttpDelete("{id}/hard")]
        public async Task<ActionResult<ArmazemDto>> HardDelete(String id)
        {
            try
            {
                var arma = await _service.DeleteAsync(new ArmazemId(id));

                if (arma == null)
                {
                    return NotFound();
                }

                return Ok(arma);
            }
            catch(BusinessRuleValidationException ex)
            {
               return BadRequest(new {Message = ex.Message});
            }
        }
    }
}