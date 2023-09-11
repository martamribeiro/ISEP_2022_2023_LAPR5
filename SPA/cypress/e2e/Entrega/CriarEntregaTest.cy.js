describe('Teste para criar Entrega', () => {
    it('passes', () => {
      cy.visit('http://localhost:3001/entrega/criar')
  
      cy.get("#inputArmazem").type("1")
      cy.get('#inputData').type("20230202")
      cy.get('#inputPeso').type("150")
      cy.get('#inputTempoCarregamento').type("20")
      cy.get('#inputTempoDescarregamento').type("20")

      cy.get("#btn-criar-entrega").click()

    })
  })