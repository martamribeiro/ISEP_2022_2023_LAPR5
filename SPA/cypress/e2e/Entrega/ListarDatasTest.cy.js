describe('Teste para listar Entrega por Datas', () => {
  it('passes', () => {
    cy.visit('http://localhost:3001/entrega/listar')

    cy.get('#opcoes-entrega').select('porDatas')

    cy.get('#dataInicialInput').type('20221201')

    cy.get('#dataFinalInput').type('20221231')

    cy.get("#btn-listar-entrega").click()
    
  })
})