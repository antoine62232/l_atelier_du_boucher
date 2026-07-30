import { jest } from '@jest/globals';
import { checkRole, checkSelfOrAdmin } from '../middleware/checkRole.js';

const mockRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe('checkRole', () => {
  const middleware = checkRole(1);
  let res, next;

  beforeEach(() => {
    res = mockRes();
    next = jest.fn();
  });

  test('laisse passer si le rôle correspond', () => {
    const req = { user: { role: 1 } };
    middleware(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('renvoie 403 si le rôle ne correspond pas', () => {
    const req = { user: { role: 2 } };
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('renvoie 403 si req.user est absent', () => {
    const req = {};
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('checkSelfOrAdmin', () => {
  let res, next;

  beforeEach(() => {
    res = mockRes();
    next = jest.fn();
  });

  test('laisse passer un admin', () => {
    const req = { user: { id: 5, role: 1 }, params: { id: '42' } };
    checkSelfOrAdmin(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('laisse passer le propriétaire du compte', () => {
    const req = { user: { id: 42, role: 2 }, params: { id: '42' } };
    checkSelfOrAdmin(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('renvoie 403 si ni admin ni propriétaire', () => {
    const req = { user: { id: 7, role: 2 }, params: { id: '42' } };
    checkSelfOrAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('renvoie 403 si req.user est absent', () => {
    const req = { params: { id: '42' } };
    checkSelfOrAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});