export const checkRole = (roleAutorise) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== roleAutorise) {
            return res.status(403).json({ message: "Accès non autorisé" });
        }
        next();
    };
};

export const checkSelfOrAdmin = (req, res, next) => {
    const idCible = Number(req.params.id);
    if (req.user && (req.user.role === 1 || req.user.id === idCible)) {
        return next();
    }
    return res.status(403).json({ message: "Accès non autorisé" });
};