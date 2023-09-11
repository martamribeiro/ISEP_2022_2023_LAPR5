describe('Teste para criar Camião', () => {
    it('passes', () => {
      cy.visit('http://localhost:3001/criarCamiao')
  
      cy.get("#inputNome").type("eTruck20")
      cy.get('#inputCargaTotalBaterias').type("560")
      cy.get('#inputTara').type("6.8")
      cy.get('#inputMaxCarga').type("8.15")
      cy.get('#inputAutonomia').type("300")
      cy.get('#inputTempoCarregamento').type("175")
      cy.get('#inputMatricula').type("39-45-WU")

      cy.get("#btn-criar-camiao").click()

    })
  })