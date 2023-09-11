describe('Teste para listar todos os Armazens', () => {
    it('passes', () => {
      cy.visit('http://localhost:3001/armazem/listar')
  
      cy.get('#opcoes-armazem').select('todos')
  
      cy.get("#btn-listar-armazem").click()
    })
  })