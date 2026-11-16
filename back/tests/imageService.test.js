import { extrairePublicId } from '../services/imageService.js';

describe('extrairePublicId', () => {
  test('retrouve le public_id d\'une URL Cloudinary avec version', () => {
    const url = 'https://res.cloudinary.com/demo/image/upload/v1731766000/atelier-du-boucher/actualites/abc123.jpg';
    expect(extrairePublicId(url)).toBe('atelier-du-boucher/actualites/abc123');
  });

  test('retrouve le public_id d\'une URL Cloudinary sans version', () => {
    const url = 'https://res.cloudinary.com/demo/image/upload/atelier-du-boucher/actualites/abc123.png';
    expect(extrairePublicId(url)).toBe('atelier-du-boucher/actualites/abc123');
  });
});
