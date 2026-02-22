describe('Integración API + Front: Perfil de Usuario', () => {
  it('Debería cargar los datos del usuario y sus cartas desde el backend', () => {
    cy.visit('http://localhost:3000/perfil');

    // Simulamos la respuesta del backend para el usuario
    cy.intercept('GET', '/api/usuarios/me', { 
      statusCode: 200,
      body: {
        nombre: 'Pepe Juarez',
        tagClash: '#PEPE123',
        mazos: [
          { nombreMazo: 'Mazo Rápido', cartas: [{ nombre: 'Montapuercos', nivel: 10, elixir: 4 }] }
        ]
      }
    }).as('getUsuario');

    cy.wait('@getUsuario');

    // Comprobamos la interacción conjunta en el frontend [cite: 63]
    cy.contains('Pepe Juarez');
    cy.contains('#PEPE123');
    cy.contains('Mazo Rápido');
    cy.contains('Montapuercos'); // Verifica que lee el sub-documento de cartas
  });
});