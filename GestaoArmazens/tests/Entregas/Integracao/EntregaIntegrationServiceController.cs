using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using System.Linq;
using Moq;
using Microsoft.AspNetCore.Mvc;
using GestaoArmazens.Domain.Entregas;
using GestaoArmazens.Domain.Armazens;
using GestaoArmazens.Controllers;
using GestaoArmazens.Domain.Shared;


namespace GestaoArmazens.tests.Entregas.Integracao
{
    [Collection("Sequential")]
    public class EntregaIntegrationServiceController
    {
        IUnitOfWork theMockedUW;
        IEntregaRepository theMockedRepo;
        EntregaService theService;

        List<Entrega> testList;

        public EntregaIntegrationServiceController()
        {
            testList = new List<Entrega>();
            testList.Add(new Entrega(new ArmazemId("10"),"20230130",100,5,5));
            testList.Add(new Entrega(new ArmazemId("11"),"20230130",101,6,6));
            testList.Add(new Entrega(new ArmazemId("12"),"20230130",102,7,7));

            var novaEntrega = new Entrega(new ArmazemId("13"),"20230130",103,8,8);

            var srv = new Mock<IEntregaRepository>();
            srv.Setup(x => x.GetAllAsync()).Returns(Task.FromResult(testList));
            srv.Setup(x => x.GetByIdAsync(testList[0].Id)).Returns(Task.FromResult(testList[0]));
            
            srv.Setup(x => x.AddAsync(It.IsAny<Entrega>())).Returns(Task.FromResult(novaEntrega));

            
            theMockedRepo = srv.Object;
            
            var uw = new Mock<IUnitOfWork>();

            uw.Setup(z => z.CommitAsync()).Returns(Task.FromResult(1));

            theMockedUW = uw.Object;
            
            theService = new EntregaService(theMockedUW, theMockedRepo) ;

        }
        
        [Fact]
        public async Task GetAllEntregas_ShouldReturnAllEntregasAsync()
        {
            //Arrange
            var theController = new EntregaController(theService);

            //Act
            var result = await theController.GetAll();

            //Assert
            var tags = Assert.IsType<List<EntregaDto>>(result.Value);
            Assert.Equal(3,tags.Count());
        }

        
        [Fact]
        public async Task GetEntregasAsync_ShouldReturnNotFound()
        {
            // Arrange      
            var theController = new EntregaController(theService);
            var testEntregaId = Guid.NewGuid();

            // Act
            var response = await theController.GetGetById(testEntregaId);

            //Assert       
            Assert.IsType<NotFoundResult>(response.Result);
        }

        [Fact]
        public async Task GetEntregaFromRepoAsync_ShouldReturnTask()
        {
            // Arrange       
            var theController = new EntregaController(theService);
            var testEntregaId = testList[0].Id.AsGuid();

            // Act
            var result = await theController.GetGetById(testEntregaId);

            //Assert     
            Assert.IsType<EntregaDto>(result.Value);
        }

        [Fact]
        public async Task GetTaskAsync_ShouldReturnTheRigthTaskAsync()
        {
            // Arrange       
            var theController = new EntregaController(theService);
            var testId = testList[0].Id.AsGuid();

            // Act
            var result = await theController.GetGetById(testId);
            var ent=result.Value;

            //Assert     
            Assert.Equal(testId, (ent as EntregaDto).Id);
        }

         [Fact]
        public async Task PostEntregaIdArmazemInvalidoInRepoAsync_ShouldReturnBadRequest()
        {
            // Arrange     
            var theController = new EntregaController(theService);

            // Act
            Func<Task> result = async () => await theController.Create(new EntregaDto(
                Guid.NewGuid(),
                new ArmazemId("1234"),
                "20230130",
                50,
                5,
                5
            ));

            // Assert            
            await Assert.ThrowsAsync<BusinessRuleValidationException>(result);
        }

         [Fact]
        public async Task PostEntregaDataInvalidaInRepoAsync_ShouldReturnBadRequest()
        {
            // Arrange     
            var theController = new EntregaController(theService);

            // Act
            Func<Task> result = async () => await theController.Create(new EntregaDto(
                Guid.NewGuid(),
                new ArmazemId("21"),
                "20210102",
                50,
                5,
                5
            ));

            // Assert            
            await Assert.ThrowsAsync<BusinessRuleValidationException>(result);
        }

         [Fact]
        public async Task PostEntregaPesoInvalidoInRepoAsync_ShouldReturnBadRequest()
        {
            // Arrange     
            var theController = new EntregaController(theService);

            // Act
            Func<Task> result = async () => await theController.Create(new EntregaDto(
                Guid.NewGuid(),
                new ArmazemId("21"),
                "20230130",
                -1,
                5,
                5
            ));

            // Assert            
            await Assert.ThrowsAsync<BusinessRuleValidationException>(result);
        }

         [Fact]
        public async Task PostEntregaTempoCarregamentoInvalidoInRepoAsync_ShouldReturnBadRequest()
        {
            // Arrange     
            var theController = new EntregaController(theService);

            // Act
            Func<Task> result = async () => await theController.Create(new EntregaDto(
                Guid.NewGuid(),
                new ArmazemId("21"),
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
            var theController = new EntregaController(theService);

            // Act
            Func<Task> result = async () => await theController.Create(new EntregaDto(
                Guid.NewGuid(),
                new ArmazemId("21"),
                "20230130",
                50,
                5,
                0
            ));

            // Assert            
            await Assert.ThrowsAsync<BusinessRuleValidationException>(result);
        }

        [Fact]
        public async Task PostValidEntregaInRepoAsync_ShouldReturnEntregaDTO()
        {
            // Arrange     
            var theController = new EntregaController(theService);
 
            // Act
            var response = await theController.Create(new EntregaDto(
                Guid.NewGuid(),
                new ArmazemId("14"),
                "20230130",
                50,
                5,
                5
            ));

            // Assert
            Assert.IsType<CreatedAtActionResult>(response.Result);
        }   

    }
}