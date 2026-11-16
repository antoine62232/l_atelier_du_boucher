export const ROLE_ADMIN = 1;

export const getUtilisateurConnecte = () => {
  const userString = localStorage.getItem("user");
  if (!userString || !localStorage.getItem("authToken")) {
    return null;
  }
  try {
    return JSON.parse(userString);
  } catch {
    return null;
  }
};

export const estAdmin = (user = getUtilisateurConnecte()) => {
  return user?.role === ROLE_ADMIN;
};

export const messageErreurApi = (error, messageParDefaut) => {
  if (error.response?.status === 401) {
    return "Ta session a expiré. Reconnecte-toi pour continuer.";
  }
  if (error.response?.status === 403) {
    return "Ton compte n'a pas les droits pour cette action.";
  }
  return error.response?.data?.error || messageParDefaut;
};
