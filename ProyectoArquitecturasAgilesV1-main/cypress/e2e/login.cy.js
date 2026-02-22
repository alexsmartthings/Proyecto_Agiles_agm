describe('Integración API + Front: Login de Usuario', () => {
  it('Debería enviar las credenciales al backend e iniciar sesión', () => {
    // 1. Visitamos la página de login de tu frontend (ajusta el puerto si es necesario)
    cy.visit('http://localhost:3000/login'); 

    // 2. Interceptamos la petición POST a tu ruta de autenticación
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token-generado-por-cypress' }
    }).as('loginRequest');

    // 3. Simulamos al usuario escribiendo en el formulario (basado en tu modelo Usuario)
    cy.get('input[name="email"]').type('pepe_test_mocha@test.com');
    cy.get('input[name="password"]').type('secretpassword123');
    cy.get('button[type="submit"]').click();

    // 4. Esperamos a que la petición se realice
    cy.wait('@loginRequest');

    // 5. Verificamos que el frontend reacciona bien (ej. redirigiendo al dashboard)
    cy.url().should('include', '/dashboard'); 
  });
});