describe('Teste para Algoritmo Simulado', () => {
    it('passes', () => {
      cy.visit('http://localhost:3001/planeamento')
  
      cy.get('#opcoes-planeamento').select('Algoritmo Simulado')

      cy.get('#inputData').type('20230130')
  
      cy.get("#btn-heuristica-armazem").click()
    })
  })