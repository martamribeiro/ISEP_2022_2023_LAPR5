describe('Teste para listar Armazem por Designação', () => {
    it('passes', () => {
      cy.visit('http://localhost:3001/armazem/listar')
  
      cy.get('#opcoes-armazem').select('porDesignacao')
  
      cy.get('#designacaoArmazemInput').type('Matosinhos')
  
      cy.get("#btn-listar-armazem").click()
    })
  })