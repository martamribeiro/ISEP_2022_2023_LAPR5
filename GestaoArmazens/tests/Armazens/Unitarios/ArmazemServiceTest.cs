using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using System.Linq;
using Moq;
using GestaoArmazens.Domain.Armazens;
using GestaoArmazens.Controllers;
using GestaoArmazens.Domain.Shared;

namespace GestaoArmazens.tests.Armazens.Unitarios
{
    [Collection("Sequential")]
    public class ArmazemServiceTest
    {
        IUnitOfWork theMockedUW;
        IArmazemRepository theMockedRepo;

        List<Armazem> testList;

        public ArmazemServiceTest()
        {              
            testList = new List<Armazem>();
            testList.Add(new Armazem("i11", "Armazem do Norte", new Morada("Rua dos Postais", 12, "4562-145", "Portelas", "Portugal"), new Coordenadas(55, 100, 21)));
            testList.Add(new Armazem("i12", "Armazem do Centro", new Morada("Rua da Lenha", 44, "4726-458", "Arroiolas", "Portugal"), new Coordenadas(20, 77, 30)));
            testList.Add(new Armazem("i13", "Armazem do Sul", new Morada("Rua dos Espinhos", 22, "4982-357", "Matagais", "Portugal"), new Coordenadas(32, 110, 35)));
           

            var novoArmazem = new Armazem("id0", "Armazem dos Testes", new Morada("Rua dos Testes", 22, "4458-159", "Testais", "Portugal"), new Coordenadas(65, 100, 11));

            var armazemAtualizado =  new Armazem(testList[0].Id.AsString(), "Nova Designacao", testList[0].Morada, testList[0].Coordenadas);

            var srv = new Mock<IArmazemRepository>();
            
            srv.Setup(x => x.GetAllAsync()).Returns(Task.FromResult(testList));
            srv.Setup(x => x.GetByIdAsync(testList[0].Id)).Returns(Task.FromResult(testList[0]));
            
            srv.Setup(x => x.AddAsync(It.IsAny<Armazem>())).Returns(Task.FromResult(novoArmazem));

            theMockedRepo = srv.Object;
            
            var uw = new Mock<IUnitOfWork>();

            uw.Setup(z => z.CommitAsync()).Returns(Task.FromResult(1));

            theMockedUW = uw.Object;
        }


         [Fact]
        public async Task GetAllArmazensFromReposAsync_ShouldReturnAllArmazensAsync()
        {
            //Arrange
            var theService = new ArmazemService(theMockedUW, theMockedRepo);

            //Act
            var result = await theService.GetAllAsync();

            //Assert
            var jogadores = Assert.IsType<List<ArmazemDto>>(result);
            Assert.Equal(3,jogadores.Count());
        }

        [Fact]
        public async Task GetArmazemFromRepoAsync_ShouldReturnNull()
        {
            // Arrange      
            var theService = new ArmazemService(theMockedUW, theMockedRepo);
            var testJogadorId = "id";

            // Act
            var response = await theService.GetByIdAsync(new ArmazemId(testJogadorId));

            //Assert       
            Assert.Null(response);
        }

        [Fact]
        public async Task GetArmazemFromRepoAsync_ShouldReturnTask()
        {
            // Arrange      
            var theService = new ArmazemService(theMockedUW, theMockedRepo);
            var testId = testList[0].Id;

            // Act
            var result = await theService.GetByIdAsync(testId);

            //Assert     
            Assert.IsType<ArmazemDto>(result);
        }

        [Fact]
        public async Task GetArmazemFromRepoWithDesignacaoAsync_ShouldReturnTask()
        {
            // Arrange      
            var theService = new ArmazemService(theMockedUW, theMockedRepo);
            var testId = testList[0].Designacao;

            // Act
            var result = await theService.GetByDesignationAsync(testId);

            //Assert     
            Assert.IsType<ArmazemDto>(result);
        }


        [Fact]
        public async Task GetArmazemFromRepoAsync_ShouldReturnTheRigthOneAsync()
        {
            // Arrange       
            var theService = new ArmazemService(theMockedUW, theMockedRepo);
            var testId = testList[0].Id;

            // Act
            var jog = await theService.GetByIdAsync(testId);

            //Assert     
            Assert.Equal(testId.AsString(), jog.Id);
        }


        [Fact]
        public async Task PostArmazemDesignacaoInvalidaInRepoAsync_ShouldReturnBadRequest()
        {
            // Arrange     
            var theService = new ArmazemService(theMockedUW, theMockedRepo);

            // Act
            Func<Task> result = async () => await theService.AddAsync(new ArmazemDto(
                "id",
                "ssjdhfksdhfkjsdhfksdhfksjdhfsdhfksjdhfksjdhskjdfhskdjhfsdhfsdoiufhjwfhsdfhsdkfhsdikjfhsdkjfhsdifsdfsdfwefwfsd",
                new Morada("Rua do Teste", 11, "4444-444", "Testerola", "Testugal"),
                new Coordenadas(10,10,10),
                true
            ));

            // Assert            
            await Assert.ThrowsAsync<BusinessRuleValidationException>(result);
        }

         [Fact]
        public async Task PostArmazemRuaInvalidaInRepoAsync_ShouldReturnBadRequest()
        {
            // Arrange     
            var theService = new ArmazemService(theMockedUW, theMockedRepo);

            // Act
            Func<Task> result = async () => await theService.AddAsync(new ArmazemDto(
                "id",
                "Armazem do Post InValido",
                new Morada("", 11, "4444-444", "Testerola", "Testugal"),
                new Coordenadas(10,10,10),
                true
            ));

            // Assert            
            await Assert.ThrowsAsync<BusinessRuleValidationException>(result);
        }

        [Fact]
        public async Task PostArmazemCodigoPostalInvalidaInRepoAsync_ShouldReturnBadRequest()
        {
            // Arrange     
            var theService = new ArmazemService(theMockedUW, theMockedRepo);

            // Act
            Func<Task> result = async () => await theService.AddAsync(new ArmazemDto(
                "id",
                "Armazem do Post InValido",
                new Morada("Rua do Teste", 11, "4444-44", "Testerola", "Testugal"),
                new Coordenadas(10,10,10),
                true
            ));

            // Assert            
            await Assert.ThrowsAsync<BusinessRuleValidationException>(result);
        }

        [Fact]
        public async Task PostArmazemLocalidadeInvalidaInRepoAsync_ShouldReturnBadRequest()
        {
            // Arrange     
            var theService = new ArmazemService(theMockedUW, theMockedRepo);

            // Act
            Func<Task> result = async () => await theService.AddAsync(new ArmazemDto(
                "id",
                "Armazem do Post InValido",
                new Morada("Rua do Teste", 11, "4444-444", "", "Testugal"),
                new Coordenadas(10,10,10),
                true
            ));

            // Assert            
            await Assert.ThrowsAsync<BusinessRuleValidationException>(result);
        }

        [Fact]
        public async Task PostArmazemPaisInvalidaInRepoAsync_ShouldReturnBadRequest()
        {
            // Arrange     
            var theService = new ArmazemService(theMockedUW, theMockedRepo);

            // Act
            Func<Task> result = async () => await theService.AddAsync(new ArmazemDto(
                "id",
                "Armazem do Post InValido",
                new Morada("Rua do Teste", 11, "4444-444", "Testerola", ""),
                new Coordenadas(10,10,10),
                true
            ));

            // Assert            
            await Assert.ThrowsAsync<BusinessRuleValidationException>(result);
        }

        [Fact]
        public async Task PostArmazemLatitudeInvalidaInRepoAsync1_ShouldReturnBadRequest()
        {
            // Arrange     
            var theService = new ArmazemService(theMockedUW, theMockedRepo);

            // Act
            Func<Task> result = async () => await theService.AddAsync(new ArmazemDto(
                "id",
                "Armazem do Post InValido",
                new Morada("Rua do Teste", 11, "4444-444", "Testerola", "Testugal"),
                new Coordenadas(-100,10,10), 
                true
            ));

            // Assert            
            await Assert.ThrowsAsync<BusinessRuleValidationException>(result);
        }

        [Fact]
        public async Task PostArmazemLatitudeInvalidaInRepoAsync2_ShouldReturnBadRequest()
        {
            // Arrange     
            var theService = new ArmazemService(theMockedUW, theMockedRepo);

            // Act
            Func<Task> result = async () => await theService.AddAsync(new ArmazemDto(
                "id",
                "Armazem do Post InValido",
                new Morada("Rua do Teste", 11, "4444-444", "Testerola", "Testugal"),
                new Coordenadas(100,10,10),
                true
            ));

            // Assert            
            await Assert.ThrowsAsync<BusinessRuleValidationException>(result);
        }

        [Fact]
        public async Task PostArmazemLongitudeInvalidaInRepoAsync1_ShouldReturnBadRequest()
        {
            // Arrange     
            var theService = new ArmazemService(theMockedUW, theMockedRepo);

            // Act
            Func<Task> result = async () => await theService.AddAsync(new ArmazemDto(
                "id",
                "Armazem do Post InValido",
                new Morada("Rua do Teste", 11, "4444-444", "Testerola", "Testugal"),
                new Coordenadas(10,-200,10), 
                true
            ));

            // Assert            
            await Assert.ThrowsAsync<BusinessRuleValidationException>(result);
        }

        [Fact]
        public async Task PostArmazemLongitudeInvalidaInRepoAsync2_ShouldReturnBadRequest()
        {
            // Arrange     
            var theService = new ArmazemService(theMockedUW, theMockedRepo);

            // Act
            Func<Task> result = async () => await theService.AddAsync(new ArmazemDto(
                "id",
                "Armazem do Post InValido",
                new Morada("Rua do Teste", 11, "4444-444", "Testerola", "Testugal"),
                new Coordenadas(10,200,10), 
                true
            ));

            // Assert            
            await Assert.ThrowsAsync<BusinessRuleValidationException>(result);
        }



        [Fact]
        public async Task PostValidArmazemInRepoAsync_ShouldReturnArmazemDTO()
        {
            // Arrange     
            var theService = new ArmazemService(theMockedUW, theMockedRepo);
 
            // Act
            var response = await theService.AddAsync(new ArmazemDto(
                "i10",
                "Armazem do Post Valido",
                new Morada("Rua do Teste", 11, "4444-444", "Testerola", "Testugal"),
                new Coordenadas(10,10,10),
                true
            ));

            // Assert
            Assert.IsType<ArmazemDto>(response);
        }   


}
}