import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Sélectionne sur le schéma la pièce demandée dans l'URL (?pieceId=12),
 * par exemple depuis une fiche pièce ou la recherche.
 */
const usePieceDemandee = (pieces, setSelection, setFace) => {
  const [searchParams] = useSearchParams();
  const pieceId = Number(searchParams.get("pieceId"));

  useEffect(() => {
    if (!pieceId || !pieces.length) return;
    const cible = pieces.find((p) => p.idPiece === pieceId);
    if (!cible) return;
    setSelection(cible);
    if (cible.face && setFace) setFace(cible.face);
  }, [pieceId, pieces, setSelection, setFace]);
};

export default usePieceDemandee;
