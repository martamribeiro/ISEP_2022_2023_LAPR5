describe('Teste para Heurística Armazém Mais Próximo', () => {
    it('passes', () => {
      cy.visit('http://localhost:3001/planeamento')
  
      cy.get('#opcoes-planeamento').select('Heurística Armazém Mais Próximo')

      cy.get('#inputData').type('20230130')

      cy.get('#inputIdCamiao').type('eTruck01')
  
      cy.get("#btn-heuristica-armazem").click()
    })
  })