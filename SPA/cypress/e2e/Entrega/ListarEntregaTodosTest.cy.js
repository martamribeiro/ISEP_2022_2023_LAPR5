describe('Teste para listar todas as Entregas', () => {
    it('passes', () => {
      cy.visit('http://localhost:3001/entrega/listar')
  
      cy.get('#opcoes-entrega').select('todos')
  
      cy.get("#btn-listar-entrega").click()
    })
  })