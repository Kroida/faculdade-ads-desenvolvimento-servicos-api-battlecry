const ForbiddenError = require("../errors/ForbiddenError");

function somenteAdmin(req, res, next) {
    if (req.usuario.tipo !== "ADMIN") {
        throw new ForbiddenError("Acesso permitido somente para administradores");
    }

    next();
}

module.exports = somenteAdmin;