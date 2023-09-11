describe('Teste para Heurística da Maior Massa', () => {
    it('passes', () => {
      cy.visit('http://localhost:3001/planeamento')
  
      cy.get('#opcoes-planeamento').select('Heurística da Maior Massa')

      cy.get('#inputData').type('20230130')

      cy.get('#inputIdCamiao').type('eTruck01')
  
      cy.get("#btn-heuristica-armazem").click()
    })
  })