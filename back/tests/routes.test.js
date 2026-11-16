import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app.js';

process.env.JWT_SECRET = 'secret_de_test';

const tokenAdmin = () => jwt.sign({ id: 1, role: 1 }, process.env.JWT_SECRET);
const tokenUser = () => jwt.sign({ id: 2, role: 2 }, process.env.JWT_SECRET);

const routesAdmin = [
  ['post', '/api/actualites/create'],
  ['put', '/api/actualites/update/1'],
  ['delete', '/api/actualites/delete/1'],
  ['post', '/api/animaux/create'],
  ['put', '/api/animaux/update/1'],
  ['delete', '/api/animaux/delete/1'],
  ['get', '/api/contacts/all'],
  ['put', '/api/contacts/update/1'],
  ['delete', '/api/contacts/delete/1'],
  ['post', '/api/faq/create'],
  ['put', '/api/faq/update/1'],
  ['delete', '/api/faq/delete/1'],
  ['post', '/api/ingredients/create'],
  ['put', '/api/ingredients/update/1'],
  ['delete', '/api/ingredients/delete/1'],
  ['post', '/api/instructions/add'],
  ['put', '/api/instructions/update/1'],
  ['delete', '/api/instructions/delete/1'],
  ['post', '/api/parties/create'],
  ['put', '/api/parties/update/1'],
  ['delete', '/api/parties/delete/1'],
  ['post', '/api/pieces/create'],
  ['put', '/api/pieces/update/1'],
  ['delete', '/api/pieces/delete/1'],
  ['post', '/api/questions/create'],
  ['put', '/api/questions/update/1'],
  ['delete', '/api/questions/delete/1'],
  ['post', '/api/races/create'],
  ['put', '/api/races/update/1'],
  ['delete', '/api/races/delete/1'],
  ['post', '/api/recettes-ingredients/add'],
  ['put', '/api/recettes-ingredients/update'],
  ['delete', '/api/recettes-ingredients/delete/1/1'],
  ['post', '/api/recettes/create'],
  ['put', '/api/recettes/update/1'],
  ['delete', '/api/recettes/delete/1'],
  ['post', '/api/reponses-qcm/create'],
  ['put', '/api/reponses-qcm/update/1'],
  ['delete', '/api/reponses-qcm/delete/1'],
  ['post', '/api/roles/create'],
  ['get', '/api/roles/all'],
  ['get', '/api/roles/1'],
  ['put', '/api/roles/update/1'],
  ['delete', '/api/roles/delete/1'],
  ['post', '/api/tags/create'],
  ['put', '/api/tags/update/1'],
  ['delete', '/api/tags/delete/1'],
  ['post', '/api/termes/create'],
  ['put', '/api/termes/update/1'],
  ['delete', '/api/termes/delete/1'],
  ['get', '/api/users/all'],
  ['put', '/api/users/admin/1'],
];

describe('Robustesse de l\'API', () => {
  test('renvoie 404 en JSON sur une route inconnue', async () => {
    const res = await request(app).get('/api/route-qui-existe-pas');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  test('renvoie 400 sur un JSON malformé', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send('{ "email": ');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('Routes réservées aux admins', () => {
  test.each(routesAdmin)('%s %s renvoie 401 sans token', async (methode, url) => {
    const res = await request(app)[methode](url);
    expect(res.status).toBe(401);
  });

  test.each(routesAdmin)('%s %s renvoie 403 avec un token utilisateur', async (methode, url) => {
    const res = await request(app)[methode](url).set('Authorization', 'Bearer ' + tokenUser());
    expect(res.status).toBe(403);
    expect(res.body).toEqual({ error: 'Accès non autorisé' });
  });

  test('renvoie 401 avec un token invalide', async () => {
    const res = await request(app)
      .post('/api/pieces/create')
      .set('Authorization', 'Bearer faux_token');
    expect(res.status).toBe(401);
  });

  test('laisse passer un admin jusqu\'au controller', async () => {
    const res = await request(app)
      .post('/api/pieces/create')
      .set('Authorization', 'Bearer ' + tokenAdmin())
      .send({});
    expect(res.status).toBe(400);
  });
});

describe('Routes réservées au propriétaire ou à un admin', () => {
  test('renvoie 403 quand un utilisateur vise le compte d\'un autre', async () => {
    const res = await request(app)
      .get('/api/users/5')
      .set('Authorization', 'Bearer ' + tokenUser());
    expect(res.status).toBe(403);
  });

  test('renvoie 403 quand un utilisateur tente de supprimer un autre compte', async () => {
    const res = await request(app)
      .delete('/api/users/delete/5')
      .set('Authorization', 'Bearer ' + tokenUser());
    expect(res.status).toBe(403);
  });
});

describe('Upload d\'image des actualités', () => {
  test('refuse un fichier qui n\'est pas une image', async () => {
    const res = await request(app)
      .post('/api/actualites/create')
      .set('Authorization', 'Bearer ' + tokenAdmin())
      .attach('image', Buffer.from('pas une image'), { filename: 'virus.txt', contentType: 'text/plain' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Format d'image non accepté" });
  });

  test('refuse une image de plus de 5 Mo', async () => {
    const res = await request(app)
      .post('/api/actualites/create')
      .set('Authorization', 'Bearer ' + tokenAdmin())
      .attach('image', Buffer.alloc(6 * 1024 * 1024), { filename: 'lourde.png', contentType: 'image/png' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Image trop lourde (5 Mo maximum)' });
  });
});
