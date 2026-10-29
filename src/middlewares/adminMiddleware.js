function somenteAdmin(req, res, next) {
    if (req.usuario.tipo !== "ADMIN") {
        return res.status(403).json({
            erro: "Acesso permitido somente para administradores"
        });
    }

    next();
}

module.exports = somenteAdmin;