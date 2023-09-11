describe('criar Percurso', () => {
    it('Percurso Válido', () => {
      cy.visit('http://localhost:3001/percurso/criar');
      cy.get('#armPartida').type("5");
      cy.get('#armChegada').type("8");
      cy.get('#distancia').type("29");
      cy.get('#duracao').type("29");
      cy.get('#energiaGasta').type("7");
      cy.get('#tempoExtra').type("0");
      //cy.get('select[id="opcoes-perc"]').select('armPartida').should('have.value', 'armPartida');
      //cy.get('#armPartidaInput').type("1");
      cy.get('#btn-criar').click();
    })
  })