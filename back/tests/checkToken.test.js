import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { checkToken } from '../middleware/checkToken.js';

process.env.JWT_SECRET = 'secret_de_test';

const mockRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe('checkToken', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = mockRes();
    next = jest.fn();
  });

  test('renvoie 401 si aucun token n\'est fourni', () => {
    checkToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('renvoie 401 si le token est invalide', () => {
    req.headers.authorization = 'Bearer faux_token';
    checkToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('laisse passer et remplit req.user si le token est valide', () => {
    const token = jwt.sign({ id: 42, role: 1 }, process.env.JWT_SECRET);
    req.headers.authorization = 'Bearer ' + token;
    checkToken(req, res, next);
    expect(req.user).toMatchObject({ id: 42, role: 1 });
    expect(next).toHaveBeenCalledTimes(1);
  });
});