const expect = require('chai').expect;
const Usuario = require('../../models/Usuario');

describe('Unit Test: Modelo de Usuario (Mocha)', () => {
    
    it('Debe lanzar un error si falta el campo email', () => {
        const usuario = new Usuario({
            nombre: 'Pepe',
            password: '123'
        });

        const err = usuario.validateSync();

        // 3. Verificaciones
        expect(err).to.exist;
        expect(err.errors['email']).to.exist;
    });

    it('Debe validar correctamente si tiene todos los campos obligatorios', () => {
        const usuario = new Usuario({
            nombre: 'Pepe Juarez',
            email: 'pepe_test_mocha@test.com',
            password: 'secretpassword123',
            rol: 'jugador',
            tagClash: '#PEPE123',
            registro: new Date(),
            mazo: [] 
        });

        const err = usuario.validateSync();

        if (err) {
            console.log("ERRORES DETECTADOS EN MOCHA:", JSON.stringify(err.errors, null, 2));
        }

        expect(err).to.be.undefined;
    });
});