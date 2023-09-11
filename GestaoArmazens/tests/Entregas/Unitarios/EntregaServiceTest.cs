using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using System.Linq;
using Moq;
using GestaoArmazens.Domain.Armazens;
using GestaoArmazens.Domain.Entregas;
using GestaoArmazens.Controllers;
using GestaoArmazens.Domain.Shared;

namespace GestaoArmazens.tests.Entregas.Unitarios
{
    [Collection("Sequential")]
    public class EntregaServiceTest
    {
        IUnitOfWork theMockedUW;
        IEntregaRepository theMockedRepo;

        List<Entrega> testList;

        public EntregaServiceTest()
        {              
            testList = new List<Entrega>();
            testList.Add(new Entrega(new ArmazemId("17"),"20230130",250,4,3));
            testList.Add(new Entrega(new ArmazemId("18"),"20230130",250,4,3));
            testList.Add(new Entrega(new ArmazemId("19"),"20230130",250,3,3));

            var novaEntrega = new Entrega(new ArmazemId("20"),"20230130",150,4,3);

            var entregaAtualizada = new Entrega(testList[0].IdArmazem, "20230130", testList[0].Peso, testList[0].TempoCarregamento, testList[0].TempoDescarregamento);

            var srv = new Mock<IEntregaRepository>();
            
            srv.Setup(x => x.GetAllAsync()).Returns(Task.FromResult(testList));
            srv.Setup(x => x.GetByIdAsync(testList[0].Id)).Returns(Task.FromResult(testList[0]));
            
            srv.Setup(x => x.AddAsync(It.IsAny<Entrega>())).Returns(Task.FromResult(novaEntrega));

            theMockedRepo = srv.Object;
            
            var uw = new Mock<IUnitOfWork>();

            uw.Setup(z => z.CommitAsync()).Returns(Task.FromResult(1));

            theMockedUW = uw.Object;
        }


         [Fact]
        public async Task GetAllEntregasFromReposAsync_ShouldReturnAllEntregasAsync()
        {
            //Arrange
            var theService = new EntregaService(theMockedUW, theMockedRepo);

            //Act
            var result = await theService.GetAllAsync();

            //Assert
            var entregas = Assert.IsType<List<EntregaDto>>(result);
            Assert.Equal(3,entregas.Count());
        }

        [Fact]
        public async Task GetEntregasFromRepoAsync_ShouldReturnNull()
        {
            // Arrange      
            var theService = new EntregaService(theMockedUW, theMockedRepo);
            var testEntregaId = Guid.NewGuid();

            // Act
            var response = await theService.GetByIdAsync(new EntregaId(testEntregaId));

            //Assert       
            Assert.Null(response);
        }

        [Fact]
        public async Task GetEntregaFromRepoAsync_ShouldReturnTask()
        {
            // Arrange      
            var theService = new EntregaService(theMockedUW, theMockedRepo);
            var testId = testList[0].Id;

            // Act
            var result = await theService.GetByIdAsync(testId);

            //Assert     
            Assert.IsType<EntregaDto>(result);
        }

        [Fact]
        public async Task GetEntregaFromRepoAsync_ShouldReturnTheRigthOneAsync()
        {
            // Arrange       
            var theService = new EntregaService(theMockedUW, theMockedRepo);
            var testId = testList[0].Id;

            // Act
            var ent = await theService.GetByIdAsync(testId);

            //Assert     
            Assert.Equal(testId.AsGuid(), ent.Id);
        }

        /*[Fact]
        public async Task PutEntregaNaoExistenteInRepo_ShouldReturnNull()
        {
            // Arrange     
            var theService = new EntregaService(theMockedUW, theMockedRepo);

            // Act
            var response = await theService.UpdateAsync(new EntregaDto(
                Guid.NewGuid(),
                new ArmazemId("20"),
                "20230130",
                50,
                5,
                5
            ));

            //Assert       
            Assert.Null(response);
        }

        [Fact]
        public async Task PutEntregaExistenteInRepo_ShouldReturnEntregaDTO()
        {
            // Arrange     
            var theService = new EntregaService(theMockedUW, theMockedRepo);
            var testEntregaExistenteId = testList[0].Id.AsGuid();

            // Act
            var response = (await theService.UpdateAsync(new EntregaDto(
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
            var theService = new EntregaService(theMockedUW, theMockedRepo);
            var testEntregaExistenteId = testList[0].Id.AsGuid();

            var novaInfo = new EntregaDto(
                testEntregaExistenteId,
                new ArmazemId("14"),
                "20230130",
                60,
                6,
                6);

            // Act
            var result = (await theService.UpdateAsync(novaInfo));  

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
            var theService = new EntregaService(theMockedUW, theMockedRepo);

            // Act
            Func<Task> result = async () => await theService.AddAsync(new EntregaDto(
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
            var theService = new EntregaService(theMockedUW, theMockedRepo);

            // Act
            Func<Task> result = async () => await theService.AddAsync(new EntregaDto(
                Guid.NewGuid(),
                new ArmazemId("23"),
                "20220103",
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
            var theService = new EntregaService(theMockedUW, theMockedRepo);

            // Act
            Func<Task> result = async () => await theService.AddAsync(new EntregaDto(
                Guid.NewGuid(),
                new ArmazemId("23"),
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
            var theService = new EntregaService(theMockedUW, theMockedRepo);

            // Act
            Func<Task> result = async () => await theService.AddAsync(new EntregaDto(
                Guid.NewGuid(),
                new ArmazemId("23"),
                "20230130",
                53,
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
            var theService = new EntregaService(theMockedUW, theMockedRepo);

            // Act
            Func<Task> result = async () => await theService.AddAsync(new EntregaDto(
                Guid.NewGuid(),
                new ArmazemId("23"),
                "20230130",
                53,
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
            var theService = new EntregaService(theMockedUW, theMockedRepo);
 
            // Act
            var response = await theService.AddAsync(new EntregaDto(
                Guid.NewGuid(),
                new ArmazemId("21"),
                "20230130",
                52,
                8,
                14
            ));

            // Assert
            Assert.IsType<EntregaDto>(response);
        }   


}
}