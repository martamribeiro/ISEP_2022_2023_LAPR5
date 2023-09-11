describe('Teste para listar Armazem por ID', () => {
  it('passes', () => {
    cy.visit('http://localhost:3001/armazem/listar')

    cy.get('#opcoes-armazem').select('porID')

    cy.get('#iDArmazemInput').type('5')

    cy.get("#btn-listar-armazem").click()
    
  })
})