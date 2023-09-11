using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using System.Linq;
using Moq;
using GestaoArmazens.Domain.Entregas;
using GestaoArmazens.Domain.Armazens;
using GestaoArmazens.Controllers;
using GestaoArmazens.Domain.Shared;
using Microsoft.AspNetCore.Mvc;

namespace GestaoArmazens.tests.Entregas.Unitarios
{
    [Collection("Sequential")]
    public class EntregaControllerTest
    {
        
        IEntregaService theMockedService;

        List<EntregaDto> testList;

        public EntregaControllerTest()
        {              
            testList = new List<EntregaDto>();
            testList.Add(new EntregaDto(Guid.NewGuid(),new ArmazemId("10"),"20230130",100,5,5));
            testList.Add(new EntregaDto(Guid.NewGuid(),new ArmazemId("11"),"20230130",101,6,6));
            testList.Add(new EntregaDto(Guid.NewGuid(),new ArmazemId("12"),"20230130",102,7,7));

            var novaEntrega = new EntregaDto(Guid.NewGuid(),new ArmazemId("13"),"20230130",103,8,8);

            var srv = new Mock<IEntregaService>();
            
            srv.Setup(x => x.GetAllAsync()).Returns(Task.FromResult(testList));
            srv.Setup(x => x.GetByIdAsync(new EntregaId(testList[0].Id))).Returns(Task.FromResult(testList[0]));
            srv.Setup(x => x.GetByIdArmazemAsync(testList[0].IdArmazem)).Returns(Task.FromResult(testList));
            srv.Setup(x => x.GetByDatasAsync(testList[0].DataEntrega,testList[0].DataEntrega)).Returns(Task.FromResult(testList));
            

            srv.Setup(x => x.AddAsync(It.IsAny<EntregaDto>())).Returns(Task.FromResult(novaEntrega));

            theMockedService = srv.Object;
            
        }


         [Fact]
        public async Task GetAllEntregasFromReposAsync_ShouldReturnAllEntregasAsync()
        {
            //Arrange
            var theController = new EntregaController(theMockedService);

            //Act
            var result = await theController.GetAll();

            //Assert
            var entregas = Assert.IsType<List<EntregaDto>>(result.Value);
            Assert.Equal(3,entregas.Count());
        }

        [Fact]
        public async Task GetEntregasFromRepoAsync_ShouldReturnNull()
        {
            // Arrange      
            var theController = new EntregaController(theMockedService);
            var testEntregaId = Guid.NewGuid();

            // Act
            var response = await theController.GetGetById(testEntregaId);

            //Assert       
            Assert.Null(response.Value);
        }

        [Fact]
        public async Task GetEntregaFromRepoAsync_ShouldReturnTask()
        {
            // Arrange      
            var theController = new EntregaController(theMockedService);
            var testId = testList[0].Id;

            // Act
            var result = await theController.GetGetById(testId);

            //Assert     
            Assert.IsType<EntregaDto>(result.Value);
        }

        [Fact]
        public async Task GetEntregaAsync_ShouldReturnTheRigthOneAsync()
        {
            // Arrange       
            var theController = new EntregaController(theMockedService);
            var testId = testList[0].Id;

            // Act
            var result = await theController.GetGetById(testId);
            var ent = result.Value;

            //Assert     
            Assert.Equal(testId, (ent as EntregaDto).Id);
        }

        /*[Fact]
        public async Task PutEntregaNaoExistenteInRepo_ShouldReturnNull()
        {
            // Arrange     
            var theController = new EntregaController(theMockedService);
            var testEntregaNaoExistenteId = Guid.NewGuid();

            // Act
            var response = await theController.Update(testEntregaNaoExistenteId, new EntregaDto(
                testEntregaNaoExistenteId,
                new ArmazemId("14"),
                "20230130",
                50,
                5,
                5
                ));

            //Assert       
            Assert.Null(response.Result);
        }

        [Fact]
        public async Task PutEntregaExistenteInRepo_ShouldReturnEntregaDTO()
        {
            // Arrange     
            var theController = new EntregaController(theMockedService);
            var testEntregaExistenteId = testList[0].Id;

            // Act
            var response = (await theController.Update(testEntregaExistenteId, new EntregaDto(
                testEntregaExistenteId,
                new ArmazemId("14"),
                "20230130",
                50,
                5,
                5)));   
            
            //Assert       
            Assert.IsType<EntregaDto>(response);
        }

        [Fact]
        public async Task PutEntregaExistenteInRepo_ShouldReturnUpdatedInfo()
        {
            // Arrange     
            var theController = new EntregaController(theMockedService);
            var testEntregaExistenteId = testList[0].Id;

            var novaInfo = new EntregaDto(
                testEntregaExistenteId,
                new ArmazemId("15"),
                "20230130",
                50,
                5,
                5);

            // Act
            var response = (await theController.Update(testEntregaExistenteId, novaInfo)).Result;  
            var result = (response as OkObjectResult).Value as EntregaDto;


            //Assert     
            Assert.Equal(novaInfo.Id,result.Id);
            Assert.Equal(novaInfo.IdArmazem, result.IdArmazem);
            Assert.Equal(novaInfo.DataEntrega, result.DataEntrega);
            Assert.Equal(novaInfo.Peso, result.Peso);
            Assert.Equal(novaInfo.TempoCarregamento,result.TempoCarregamento);
            Assert.Equal(novaInfo.TempoDescarregamento,result.TempoDescarregamento);
        }*/



        [Fact]
        public async Task PostEntregaIdArmazemInvalidoInRepoAsync_ShouldReturnBadRequest()
        {
            // Arrange     
            var theController = new EntregaController(theMockedService);

            // Act
            Func<Task> result = async () => await theController.Create(new EntregaDto(
                Guid.NewGuid(),
                new ArmazemId("1234"),
                "20230130",
                52,
                8,
                5
            ));

            // Assert            
            await Assert.ThrowsAsync<BusinessRuleValidationException>(result);
        }      

        [Fact]
        public async Task PostEntregaDataInvalidaInRepoAsync_ShouldReturnBadRequest()
        {
            // Arrange     
            var theController = new EntregaController(theMockedService);

            // Act
            Func<Task> result = async () => await theController.Create(new EntregaDto(
                Guid.NewGuid(),
                new ArmazemId("22"),
                "20210103",
                52,
                8,
                5
            ));

            // Assert            
            await Assert.ThrowsAsync<BusinessRuleValidationException>(result);
        } 

        [Fact]
        public async Task PostEntregaPesoInvalidoInRepoAsync_ShouldReturnBadRequest()
        {
            // Arrange     
            var theController = new EntregaController(theMockedService);

            // Act
            Func<Task> result = async () => await theController.Create(new EntregaDto(
                Guid.NewGuid(),
                new ArmazemId("22"),
                "20230130",
                0,
                8,
                5
            ));

            // Assert            
            await Assert.ThrowsAsync<BusinessRuleValidationException>(result);
        }    

        [Fact]
        public async Task PostEntregaTempoCarregamentoInvalidoInRepoAsync_ShouldReturnBadRequest()
        {
            // Arrange     
            var theController = new EntregaController(theMockedService);

            // Act
            Func<Task> result = async () => await theController.Create(new EntregaDto(
                Guid.NewGuid(),
                new ArmazemId("22"),
                "20230130",
                50,
                0,
                5
            ));

            // Assert            
            await Assert.ThrowsAsync<BusinessRuleValidationException>(result);
        }    

        [Fact]
        public async Task PostEntregaTempoDescarregamentoInvalidoInRepoAsync_ShouldReturnBadRequest()
        {
            // Arrange     
            var theController = new EntregaController(theMockedService);

            // Act
            Func<Task> result = async () => await theController.Create(new EntregaDto(
                Guid.NewGuid(),
                new ArmazemId("22"),
                "20230130",
                50,
                8,
                0
            ));

            // Assert            
            await Assert.ThrowsAsync<BusinessRuleValidationException>(result);
        }   

        [Fact]
        public async Task PostValidEntregaInRepoAsync_ShouldReturnEntregaDTO()
        {
            // Arrange     
            var theController = new EntregaController(theMockedService);

            // Act
            var response = await theController.Create(new EntregaDto(
                Guid.NewGuid(),
                new ArmazemId("16"),
                "20230130",
                52,
                8,
                14
            ));

            // Assert
            Assert.IsType<CreatedAtActionResult>(response.Result);
        }   


}
}