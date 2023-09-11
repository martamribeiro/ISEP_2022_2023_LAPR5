describe('Teste para listar Entrega por ID de Armazem', () => {
  it('passes', () => {
    cy.visit('http://localhost:3001/entrega/listar')

    cy.get('#opcoes-entrega').select('porIdArmazem')

    cy.get('#idArmazemInput').type('1')

    cy.get("#btn-listar-entrega").click()
    
  })
})