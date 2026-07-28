import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { checkToken } from '../middleware/checkToken.js';

process.env.JWT_SECRET = 'secret_de_test';

const fakeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('checkToken', () => {
  test('renvoie 401 si aucun token n\'est fourni', () => {
    const req = { headers: {} };
    const res = fakeRes();
    const next = jest.fn();

    checkToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('renvoie 401 si le token est invalide', () => {
    const req = { headers: { authorization: 'Bearer token_bidon' } };
    const res = fakeRes();
    const next = jest.fn();

    checkToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('laisse passer et remplit req.user si le token est valide', () => {
    const token = jwt.sign({ id: 42, role: 1 }, process.env.JWT_SECRET);
    const req = { headers: { authorization: 'Bearer ' + token } };
    const res = fakeRes();
    const next = jest.fn();

    checkToken(req, res, next);

    expect(req.user.id).toBe(42);
    expect(req.user.role).toBe(1);
    expect(next).toHaveBeenCalledTimes(1);
  });
});