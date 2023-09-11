describe('Teste para Algoritmo Genético', () => {
    it('passes', () => {
      cy.visit('http://localhost:3001/planeamento')
  
      cy.get('#opcoes-planeamento').select('Algoritmo Genético')

      cy.get('#inputData').type('20230130')
  
      cy.get("#btn-heuristica-armazem").click()
    })
  })