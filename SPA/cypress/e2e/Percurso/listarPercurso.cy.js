describe('listar Percurso 1', () => {
  it('Filtrar por Armazém de Partida', () => {
    cy.visit('http://localhost:3001/percurso/listar');
    cy.get('select[id="opcoes-perc"]').select('armPartida').should('have.value', 'armPartida');
    cy.get('#armPartidaInput').type("1");
    cy.get('#btn-listar-perc').click();
  })
})

describe('listar Percurso 2', () => {
  it('Filtrar por Armazém de Chegada', () => {
    cy.visit('http://localhost:3001/percurso/listar');
    cy.get('select[id="opcoes-perc"]').select('armChegada').should('have.value', 'armChegada');
    cy.get('#armChegadaInput').type("5");
    cy.get('#btn-listar-perc').click();
  })
})

describe('listar Percurso 3', () => {
  it('Filtrar por Armazém de Partida e Armazém de Chegada', () => {
    cy.visit('http://localhost:3001/percurso/listar');
    cy.get('select[id="opcoes-perc"]').select('armPartidaEChegada').should('have.value', 'armPartidaEChegada');
    cy.get('#armPartidaInput').type("1");
    cy.get('#armChegadaInput').type("5");
    cy.get('#btn-listar-perc').click();
  })
})

describe('listar Percurso 4', () => {
  it('Todos', () => {
    cy.visit('http://localhost:3001/percurso/listar');
    cy.get('select[id="opcoes-perc"]').select('todos').should('have.value', 'todos');
    cy.get('#btn-listar-perc').click();
  })
})