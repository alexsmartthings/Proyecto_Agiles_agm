const Partido = require('../../models/Partido');
const mongoose = require('mongoose');

describe('Unit Test: Modelo de Partido (Jest)', () => {

    it('Debe validar correctamente si se aportan los campos obligatorios', () => {
        const partido = new Partido({
            torneo: new mongoose.Types.ObjectId(),
            ronda: 1, 
            jugador1: new mongoose.Types.ObjectId(),
            jugador2: new mongoose.Types.ObjectId(),
            marcador: {
                coronasJ1: 0,
                coronasJ2: 0
            }
        });

        const error = partido.validateSync();
        expect(error).toBeUndefined();
    });

    it('Debe fallar si los marcadores no son números', () => {
        const partido = new Partido({
            torneo: new mongoose.Types.ObjectId(),
            ronda: 1,
            jugador1: new mongoose.Types.ObjectId(),
            jugador2: new mongoose.Types.ObjectId(),
            // Estructura correcta pero DATO INCORRECTO (String en vez de Number)
            marcador: {
                coronasJ1: "Texto Invalido", 
                coronasJ2: 0
            }
        });

        const error = partido.validateSync();
        
        expect(error).toBeDefined();
        expect(error.errors['marcador.coronasJ1']).toBeDefined();
    });
});