const authMiddleware = require('../../middleware/auth');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('Unit Test: Middleware de Autenticación (Jest)', () => {
    let req, res, next;

    beforeEach(() => {
        req = { header: jest.fn().mockReturnValue(null) };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
    });

    it('Debe devolver 401 si no hay token en el header', () => {
        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ msg: 'No hay token, permiso no válido' });
    });

    it('Debe llamar a next() si el token es válido', () => {
        req.header.mockReturnValue('mi-token-falso');
        jwt.verify.mockReturnValue({ usuario: { id: '123' } });

        authMiddleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.usuario).toBeDefined();
    });
});