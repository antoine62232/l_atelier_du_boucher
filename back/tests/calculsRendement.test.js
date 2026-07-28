import { calculerRendement } from '../utils/calculsRendement.js';

describe('calculerRendement', () => {
  test('calcule la perte, le rendement, le prix de revient et le prix de vente', () => {
    const r = calculerRendement({
      poidsBrut: 10,
      poidsNet: 8,
      prixAchatKg: 20,
      margeVisee: 50,
      tauxTva: 5.5,
    });

    expect(r.poidsPerte).toBeCloseTo(2, 3);
    expect(r.resultatRendement).toBeCloseTo(80, 2);
    expect(r.prixRevientKg).toBeCloseTo(25, 2);
    expect(r.prixVenteConseilleKg).toBeCloseTo(52.75, 2);
  });

  test('applique la TVA par défaut de 5.50 si elle n\'est pas fournie', () => {
    const r = calculerRendement({
      poidsBrut: 10,
      poidsNet: 8,
      prixAchatKg: 20,
      margeVisee: 50,
    });

    expect(r.tva).toBe(5.5);
  });
});