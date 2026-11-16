const CLE_DERNIERE_VIDEO = "derniereVideo";

export const getYoutubeId = (url) => {
  if (!url) return null;
  const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  return match && match[2].length === 11 ? match[2] : null;
};

export const getYoutubeMiniature = (url) => {
  const id = getYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
};

export const enregistrerDerniereVideo = (video) => {
  try {
    localStorage.setItem(
      CLE_DERNIERE_VIDEO,
      JSON.stringify({
        idRessource: video.idRessource,
        titre: video.titre,
        urlVideo: video.urlVideo,
        typeTechnique: video.typeTechnique,
        nomAnimal: video.nomAnimal,
        nomPartie: video.nomPartie,
      })
    );
  } catch {
    // stockage indisponible (navigation privée) : on ignore
  }
};

export const lireDerniereVideo = () => {
  try {
    const valeur = localStorage.getItem(CLE_DERNIERE_VIDEO);
    return valeur ? JSON.parse(valeur) : null;
  } catch {
    return null;
  }
};
