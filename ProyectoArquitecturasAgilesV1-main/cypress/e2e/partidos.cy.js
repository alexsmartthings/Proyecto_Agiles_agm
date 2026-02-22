describe('Integración API + Front: Lista de Partidos', () => {
  it('Debería mostrar los partidos obtenidos del backend', () => {
    cy.visit('http://localhost:3000/partidos');

    // Interceptamos la petición GET y devolvemos el fixture [cite: 41]
    cy.intercept('GET', '/api/partidos', { fixture: 'partidos.json' }).as('getPartidos');

    // Esperamos la respuesta [cite: 51]
    cy.wait('@getPartidos');

    // Verificamos que el DOM se actualice y muestre los 2 partidos [cite: 52]
    // (Ajusta '.partido-card' a la clase real que uses en tu frontend)
    cy.get('.partido-card').should('have.length', 2);
    cy.contains('Ronda: 1');
  });
});