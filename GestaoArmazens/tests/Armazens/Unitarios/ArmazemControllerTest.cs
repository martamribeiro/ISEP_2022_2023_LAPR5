using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using System.Linq;
using Moq;
using GestaoArmazens.Domain.Armazens;
using GestaoArmazens.Controllers;
using GestaoArmazens.Domain.Shared;
using Microsoft.AspNetCore.Mvc;

namespace GestaoArmazens.tests.Armazens.Unitarios
{
    [Collection("Sequential")]
    public class ArmazemControllerTest
    {
        
        IArmazemService theMockedService;

        List<ArmazemDto> testList;

        public ArmazemControllerTest()
        {              
            testList = new List<ArmazemDto>();
            testList.Add(new ArmazemDto("i11", "Armazem do Norte", new Morada("Rua dos Postais", 12, "4562-145", "Portelas", "Portugal"), new Coordenadas(55, 100, 21), true));
            testList.Add(new ArmazemDto("i12", "Armazem do Centro", new Morada("Rua da Lenha", 44, "4726-458", "Arroiolas", "Portugal"), new Coordenadas(20, 77, 30), true));
            testList.Add(new ArmazemDto("i13", "Armazem do Sul", new Morada("Rua dos Espinhos", 22, "4982-357", "Matagais", "Portugal"), new Coordenadas(32, 110, 35), true));
           

           var novoArmazem = new ArmazemDto("id0", "Armazem dos Testes", new Morada("Rua dos Testes", 22, "4458-159", "Testais", "Portugal"), new Coordenadas(65, 100, 11), true);

            var srv = new Mock<IArmazemService>();
            
            srv.Setup(x => x.GetAllAsync()).Returns(Task.FromResult(testList));
            srv.Setup(x => x.GetByIdAsync(new ArmazemId(testList[0].Id))).Returns(Task.FromResult(testList[0]));
            srv.Setup(x => x.GetByDesignationAsync(testList[0].Designcacao)).Returns(Task.FromResult(testList[0]));
            
            srv.Setup(x => x.AddAsync(It.IsAny<ArmazemDto>())).Returns(Task.FromResult(novoArmazem));

            theMockedService = srv.Object;
            
        }


         [Fact]
        public async Task GetAllArmazensFromReposAsync_ShouldReturnAllArmazensAsync()
        {
            //Arrange
            var theController = new ArmazemController(theMockedService);

            //Act
            var result = await theController.GetAll();

            //Assert
            var jogadores = Assert.IsType<List<ArmazemDto>>(result.Value);
            Assert.Equal(3,jogadores.Count());
        }

        [Fact]
        public async Task GetArmazemFromRepoAsync_ShouldReturnNull()
        {
            // Arrange      
            var theController = new ArmazemController(theMockedService);
            var testJogadorId = "id";

            // Act
            var response = await theController.GetGetById(testJogadorId);

            //Assert       
            Assert.Null(response.Value);
        }

        [Fact]
        public async Task GetArmazemFromRepoAsync_ShouldReturnTask()
        {
            // Arrange      
            var theController = new ArmazemController(theMockedService);
            var testId = testList[0].Id;

            // Act
            var result = await theController.GetGetById(testId);

            //Assert     
            Assert.IsType<ArmazemDto>(result.Value);
        }

        [Fact]
        public async Task GetArmazemFromRepoWithDesignacaoAsync_ShouldReturnTask()
        {
            // Arrange      
            var theController = new ArmazemController(theMockedService);
            var testId = testList[0].Designcacao;

            // Act
            var result = await theController.GetByDesignationAsync(testId);

            //Assert     
            Assert.IsType<ArmazemDto>(result.Value);
        }

        [Fact]
        public async Task GetArmazemAsync_ShouldReturnTheRigthOneAsync()
        {
            // Arrange       
            var theController = new ArmazemController(theMockedService);
            var testId = testList[0].Id;

            // Act
            var result = await theController.GetGetById(testId);
            var jog = result.Value;

            //Assert     
            Assert.Equal(testId, (jog as ArmazemDto).Id);
        }

        [Fact]
        public async Task PostArmazemDesignacaoInvalidaInRepoAsync_ShouldReturnBadRequest()
        {
            // Arrange     
            var theController = new ArmazemController(theMockedService);

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
            var theController = new ArmazemController(theMockedService);

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
            var theController = new ArmazemController(theMockedService);

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
            var theController = new ArmazemController(theMockedService);

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
            var theController = new ArmazemController(theMockedService);

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
            var theController = new ArmazemController(theMockedService);

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
            var theController = new ArmazemController(theMockedService);

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
            var theController = new ArmazemController(theMockedService);

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
            var theController = new ArmazemController(theMockedService);

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
            var theController = new ArmazemController(theMockedService);
 
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