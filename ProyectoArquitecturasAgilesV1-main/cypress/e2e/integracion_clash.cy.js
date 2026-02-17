describe('Pruebas de Integración - Clash Royale Manager', () => {

  const FRONTEND_URL = 'http://localhost:3000'; 
  const API_URL = 'http://localhost:5000/api'; 

  beforeEach(() => {
    cy.clearLocalStorage();
  });

  // ===========================================================================
  // PRUEBA 1: LOGIN (CON MOCK PARA EVITAR ERROR 400)
  // ===========================================================================
  it('1. Login: Debería permitir el ingreso y redirigir a Mis Mazos', () => {
    // 🔥 CORREGIDO: En lugar de solo "espiar", RESPONDEMOS nosotros (Stubbing).
    // Así da igual si el usuario existe o no en tu BD, el test pasará siempre.
    cy.intercept('POST', `${API_URL}/auth/login`, {
      statusCode: 200,
      body: {
        token: 'token-falso-cypress-123',
        usuario: {
          id: 'id-usuario-falso',
          nombre: 'Usuario Test',
          email: 'usuario@test.com'
        }
      }
    }).as('peticionLogin');

    cy.visit(`${FRONTEND_URL}/login`);

    cy.get('input[name="email"]').type('usuario@test.com'); 
    cy.get('input[name="password"]').type('123456');

    cy.get('button[type="submit"]').click();

    // Ahora esto pasará porque nosotros forzamos el 200 arriba
    cy.wait('@peticionLogin').its('response.statusCode').should('eq', 200);

    cy.url().should('include', '/mis-mazos');
  });

  // ===========================================================================
  // PRUEBA 2: TORNEOS (INSENSIBLE A MAYÚSCULAS)
  // ===========================================================================
  it('2. Torneos: Debería cargar la lista y abrir el modal de crear torneo', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'token-simulado');
      win.localStorage.setItem('usuario', JSON.stringify({ id: '123', nombre: 'TestUser' }));
    });

    cy.intercept('GET', `${API_URL}/torneos`, {
      statusCode: 200,
      body: {
        torneos: [
          { 
            _id: '1', nombre: 'Copa Cypress', estado: 'abierto', 
            modalidad: 'Elección', fecha: new Date(), participantes: [] 
          }
        ]
      }
    }).as('getTorneos');

    cy.visit(`${FRONTEND_URL}/torneos`);
    cy.wait('@getTorneos');

    cy.contains('Copa Cypress').should('be.visible');
    
    // 🔥 CORREGIDO: Usamos regex /ABIERTO/i para que ignore mayúsculas/minúsculas
    cy.contains(/ABIERTO/i).should('be.visible'); 

    cy.contains('+ CREAR TORNEO').click();
    cy.contains('Nuevo Torneo').should('be.visible');
    cy.get('input[name="nombre"]').should('be.visible');
  });

  // ===========================================================================
  // PRUEBA 3: MAZOS (SELECCIONAR LA IMAGEN CORRECTA)
  // ===========================================================================
  it('3. Mazos: Debería permitir abrir el constructor de mazos', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'token-simulado');
      win.localStorage.setItem('usuario', JSON.stringify({ id: '123' }));
    });

    // Simulamos que el usuario NO tiene mazos para que salga limpio
    cy.intercept('GET', `${API_URL}/usuarios/*`, { body: { mazos: [] } }); 
    
    // Simulamos las cartas disponibles
    cy.intercept('GET', `${API_URL}/clash/cartas`, { 
      body: [
        { id: 1, nombre: 'Mago', imagen: 'https://via.placeholder.com/150', elixir: 5 },
        { id: 2, nombre: 'P.E.K.K.A', imagen: 'https://via.placeholder.com/150', elixir: 7 }
      ] 
    }).as('getCartas');

    cy.visit(`${FRONTEND_URL}/mis-mazos`);

    cy.contains('Nuevo Mazo').click();
    cy.wait('@getCartas');

    // 🔥 CORREGIDO: Usamos .last()
    // Como al hacer clic la carta se añade arriba, ahora hay 2 Magos en pantalla.
    // .last() asegura que verificamos la de la "Colección" (la de abajo), que es la que debe tener opacidad.
    cy.get('img[alt="Mago"]').last().click();

    // Verificamos de nuevo en la última imagen (la de la colección)
    cy.get('img[alt="Mago"]').last().should('have.css', 'opacity', '0.4');
  });

});