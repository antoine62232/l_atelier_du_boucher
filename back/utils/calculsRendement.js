export const calculerRendement = ({ poidsBrut, poidsNet, prixAchatKg, margeVisee, tauxTva }) => {
  const pb = parseFloat(poidsBrut);
  const pn = parseFloat(poidsNet);
  const pa = parseFloat(prixAchatKg);
  const mv = parseFloat(margeVisee);
  const tva = tauxTva ? parseFloat(tauxTva) : 5.50;

  const poidsPerte = pb - pn;
  const resultatRendement = (pn / pb) * 100;
  const prixRevientKg = (pb * pa) / pn;
  const prixVenteHt = prixRevientKg / (1 - mv / 100);
  const prixVenteConseilleKg = prixVenteHt * (1 + tva / 100);

  return {
    poidsPerte,
    resultatRendement,
    prixRevientKg,
    prixVenteConseilleKg,
    tva,
  };
};