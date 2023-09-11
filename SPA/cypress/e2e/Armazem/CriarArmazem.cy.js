describe('Teste para criar Armazem', () => {
    it('passes', () => {
      cy.visit('http://localhost:3001/criarArmazem')
  
      cy.get("#inputArmazem").type("30")
      cy.get('#inputDesignacao').type("Madrid")
      cy.get('#inputRua').type("Rua de las Cucarachas")
      cy.get('#inputPorta').type("20")
      cy.get('#inputPostal').type("1259-321")
      cy.get('#inputLocalidade').type("Madrid")
      cy.get('#inputPais').type("Espanha")
      cy.get('#inputLatitude').type("80.0")
      cy.get('#inputLongitude').type("80.0")
      cy.get('#inputAltitude').type("80")

      cy.get("#btn-criar-armazem").click()

    })
  })