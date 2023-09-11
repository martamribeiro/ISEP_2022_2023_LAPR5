using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using System.Linq;
using Moq;
using Microsoft.AspNetCore.Mvc;
using GestaoArmazens.Domain.Armazens;
using GestaoArmazens.Controllers;
using GestaoArmazens.Domain.Shared;


namespace GestaoArmazens.tests.Armazens.Integracao
{
    [Collection("Sequential")]
    public class ArmazemIntegrationServiceController
    {
        IUnitOfWork theMockedUW;
        IArmazemRepository theMockedRepo;
        ArmazemService theService;

        List<Armazem> testList;

        public ArmazemIntegrationServiceController()
        {
            testList = new List<Armazem>();
            testList.Add(new Armazem("i11", "Armazem do Norte", new Morada("Rua dos Postais", 12, "4562-145", "Portelas", "Portugal"), new Coordenadas(55, 100, 21)));
            testList.Add(new Armazem("i12", "Armazem do Centro", new Morada("Rua da Lenha", 44, "4726-458", "Arroiolas", "Portugal"), new Coordenadas(20, 77, 30)));
            testList.Add(new Armazem("i13", "Armazem do Sul", new Morada("Rua dos Espinhos", 22, "4982-357", "Matagais", "Portugal"), new Coordenadas(32, 110, 35)));
           

            var novoArmazem = new Armazem("id0", "Armazem dos Testes", new Morada("Rua dos Testes", 22, "4458-159", "Testais", "Portugal"), new Coordenadas(65, 100, 11));

            var srv = new Mock<IArmazemRepository>();
            srv.Setup(x => x.GetAllAsync()).Returns(Task.FromResult(testList));
            srv.Setup(x => x.GetByIdAsync(testList[0].Id)).Returns(Task.FromResult(testList[0]));
            
            srv.Setup(x => x.AddAsync(It.IsAny<Armazem>())).Returns(Task.FromResult(novoArmazem));

            
            theMockedRepo = srv.Object;
            
            var uw = new Mock<IUnitOfWork>();

            uw.Setup(z => z.CommitAsync()).Returns(Task.FromResult(1));

            theMockedUW = uw.Object;
            
            theService = new ArmazemService(theMockedUW, theMockedRepo) ;

        }
        
        [Fact]
        public async Task GetAllArmazens_ShouldReturnAllArmazensAsync()
        {
            //Arrange
            var theController = new ArmazemController(theService);

            //Act
            var result = await theController.GetAll();

            //Assert
            var tags = Assert.IsType<List<ArmazemDto>>(result.Value);
            Assert.Equal(3,tags.Count());
        }

        
        [Fact]
        public async Task GetArmazensAsync_ShouldReturnNotFound()
        {
            // Arrange      
            var theController = new ArmazemController(theService);
            var testJogadorId = "id";

            // Act
            var response = await theController.GetGetById(testJogadorId);

            //Assert       
            Assert.IsType<NotFoundResult>(response.Result);
        }

        [Fact]
        public async Task GetArmazemFromRepoAsync_ShouldReturnTask()
        {
            // Arrange       
            var theController = new ArmazemController(theService);
            var testJogadorId = testList[0].Id.Value;

            // Act
            var result = await theController.GetGetById(testJogadorId);

            //Assert     
            Assert.IsType<ArmazemDto>(result.Value);
        }

        [Fact]
        public async Task GetTaskAsync_ShouldReturnTheRigthTaskAsync()
        {
            // Arrange       
            var theController = new ArmazemController(theService);
            var testId = testList[0].Id.Value;

            // Act
            var result = await theController.GetGetById(testId);
            var jog=result.Value;

            //Assert     
            Assert.Equal(testId, (jog as ArmazemDto).Id);
        }

        [Fact]
        public async Task GetArmazemFromRepoWithDesignacaoAsync_ShouldReturnTask()
        {
            // Arrange       
            var theController = new ArmazemController(theService);
            var testJogadorId = testList[0].Designacao;

            // Act
            var result = await theController.GetByDesignationAsync(testJogadorId);

            //Assert     
            Assert.IsType<ArmazemDto>(result.Value);
        }

         [Fact]
        public async Task PostArmazemDesignacaoInvalidaInRepoAsync_ShouldReturnBadRequest()
        {
            // Arrange     
            var theController = new ArmazemController(theService);

            // Act
            Func<Task> result = async () => await theController.Create(new ArmazemDto(
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
            var theController = new ArmazemController(theService);

            // Act
            Func<Task> result = async () => await theController.Create(new ArmazemDto(
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
            var theController = new ArmazemController(theService);

            // Act
            Func<Task> result = async () => await theController.Create(new ArmazemDto(
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
            var theController = new ArmazemController(theService);

            // Act
            Func<Task> result = async () => await theController.Create(new ArmazemDto(
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
            var theController = new ArmazemController(theService);

            // Act
            Func<Task> result = async () => await theController.Create(new ArmazemDto(
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
            var theController = new ArmazemController(theService);

            // Act
            Func<Task> result = async () => await theController.Create(new ArmazemDto(
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
            var theController = new ArmazemController(theService);

            // Act
            Func<Task> result = async () => await theController.Create(new ArmazemDto(
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
            var theController = new ArmazemController(theService);

            // Act
            Func<Task> result = async () => await theController.Create(new ArmazemDto(
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
            var theController = new ArmazemController(theService);

            // Act
            Func<Task> result = async () => await theController.Create(new ArmazemDto(
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
            var theController = new ArmazemController(theService);
 
            // Act
            var response = await theController.Create(new ArmazemDto(
                "i10",
                "Armazem do Post Valido",
                new Morada("Rua do Teste", 11, "4444-444", "Testerola", "Testugal"),
                new Coordenadas(10,10,10),
                true
            ));

            // Assert
            Assert.IsType<CreatedAtActionResult>(response.Result);
        }   

    }
}