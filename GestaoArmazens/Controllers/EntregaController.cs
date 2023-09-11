using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using GestaoArmazens.Domain.Shared;
using GestaoArmazens.Domain.Entregas;
using GestaoArmazens.Domain.Armazens;


namespace GestaoArmazens.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EntregaController : ControllerBase
    {
        private readonly IEntregaService _service;

        public EntregaController(IEntregaService service)
        {
            _service = service;
        }

        // GET: api/Entregas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EntregaDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        [HttpGet("dataAscendente")]
        public async Task<ActionResult<IEnumerable<EntregaDto>>> GetAllDataAscendente()
        {
            return await _service.GetAllDataAscendenteAsync();
        }

        [HttpGet("idArmazemAscendente")]
        public async Task<ActionResult<IEnumerable<EntregaDto>>> GetAllIdArmazemAscendente()
        {
            return await _service.GetAllIdArmazemAscendenteAsync();
        }

        // GET: api/Entregas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EntregaDto>> GetGetById(Guid id)
        {
            var entr = await _service.GetByIdAsync(new EntregaId(id));

            if (entr == null)
            {
                return NotFound();
            }

            return entr;
        }

        [HttpGet("porIdArmazem")]
        public async Task<ActionResult<IEnumerable<EntregaDto>>> GetGetByIdArmazem(String idArmazem)
        {
            return await _service.GetByIdArmazemAsync(new ArmazemId(idArmazem));
        }

        [HttpGet("porIdArmazemDataAscendente")]
        public async Task<ActionResult<IEnumerable<EntregaDto>>> GetGetByIdArmazemDataAscendenteAsync(String idArmazem)
        {
            return await _service.GetByIdArmazemDataAscendenteAsync(new ArmazemId(idArmazem));
        }

        [HttpGet("porDatas")]
        public async Task<ActionResult<IEnumerable<EntregaDto>>> GetGetByDatas(string data1, string data2)
        {
            return await _service.GetByDatasAsync(data1,data2);
        }

        [HttpGet("porDatasDataAscendente")]
        public async Task<ActionResult<IEnumerable<EntregaDto>>> GetGetByDatasDataAscendenteAsync(string data1, string data2)
        {
            return await _service.GetByDatasDataAscendenteAsync(data1,data2);
        }

        [HttpGet("porDatasIdArmazemAscendente")]
        public async Task<ActionResult<IEnumerable<EntregaDto>>> GetGetByDatasIdArmazemAscendenteAsync(string data1, string data2)
        {
            return await _service.GetByDatasIdArmazemAscendenteAsync(data1,data2);
        }

        [HttpGet("porIdArmazemEDatas")]
        public async Task<ActionResult<IEnumerable<EntregaDto>>> GetGetByIdArmazemEDatas(String idArmazem, string data1, string data2)
        {
            return await _service.GetByIdArmazemEDatasAsync(new ArmazemId(idArmazem),data1,data2);
        }

        [HttpGet("porIdArmazemEDatasDataAscendente")]
        public async Task<ActionResult<IEnumerable<EntregaDto>>> GetGetByIdArmazemEDatasDataAscendenteAsync(String idArmazem, string data1, string data2)
        {
            return await _service.GetByIdArmazemEDatasDataAscendenteAsync(new ArmazemId(idArmazem),data1,data2);
        }

        [HttpGet("porIdArmazemEDatasIdArmazemAscendente")]
        public async Task<ActionResult<IEnumerable<EntregaDto>>> GetGetByIdArmazemEDatasIdArmazemAscendenteAsync(String idArmazem, string data1, string data2)
        {
            return await _service.GetByIdArmazemEDatasIdArmazemAscendenteAsync(new ArmazemId(idArmazem),data1,data2);
        }

        // POST: api/Entregas
        [HttpPost]
        public async Task<ActionResult<EntregaDto>> Create(EntregaDto dto)
        {
            try
            {
                var entr = await _service.AddAsync(dto);

                return CreatedAtAction(nameof(GetGetById), new { id = entr.Id }, entr);
            }
            catch(BusinessRuleValidationException ex)
            {
                return BadRequest(new {Message = ex.Message});
            }
        }

        
        // PUT: api/Entregas/5
        [HttpPut("{id}")]
        public async Task<ActionResult<EntregaDto>> Update(Guid id, EntregaDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }

            try
            {
                var entr = await _service.UpdateAsync(dto);
                
                if (entr == null)
                {
                    return NotFound();
                }
                return Ok(entr);
            }
            catch(BusinessRuleValidationException ex)
            {
                return BadRequest(new {Message = ex.Message});
            }
        }

        // Inactivate: api/Entregas/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<EntregaDto>> SoftDelete(Guid id)
        {
            var entr = await _service.InactivateAsync(new EntregaId(id));

            if (entr == null)
            {
                return NotFound();
            }

            return Ok(entr);
        }
        
        // DELETE: api/Entregas/5
        [HttpDelete("{id}/hard")]
        public async Task<ActionResult<EntregaDto>> HardDelete(Guid id)
        {
            try
            {
                var entr = await _service.DeleteAsync(new EntregaId(id));

                if (entr == null)
                {
                    return NotFound();
                }

                return Ok(entr);
            }
            catch(BusinessRuleValidationException ex)
            {
               return BadRequest(new {Message = ex.Message});
            }
        }
    }
}