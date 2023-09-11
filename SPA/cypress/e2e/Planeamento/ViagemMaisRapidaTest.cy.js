describe('Teste para Viagem Mais Rápida', () => {
    it('passes', () => {
      cy.visit('http://localhost:3001/planeamento')
  
      cy.get('#opcoes-planeamento').select('Viagem Mais Rápida')

      cy.get('#inputData').type('20221208')

      cy.get('#inputIdCamiao').type('eTruck01')
  
      cy.get("#btn-heuristica-armazem").click()
    })
  })