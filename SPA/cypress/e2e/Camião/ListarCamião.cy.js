describe('Listar Camião', () => {
    it('Todos', () => {
      cy.visit('http://localhost:3001/camiao/listar');
      cy.get('select[id="opcoes-camiao"]').select('todos').should('have.value', 'todos');
      cy.get('#btn-listar-camiao').click();
    })
})