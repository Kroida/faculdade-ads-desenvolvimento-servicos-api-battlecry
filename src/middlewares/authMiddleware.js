const jwt = require("jsonwebtoken");

const UnauthorizedError = require("../errors/UnauthorizedError");

function autenticar(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization) {
        throw new UnauthorizedError("Token não informado");
    }

    const [tipo, token] = authorization.split(" ");

    if (tipo !== "Bearer" || !token) {
        throw new UnauthorizedError("Token inválido");
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuario = payload;

        next();
    } catch (error) {
        throw new UnauthorizedError("Token inválido");
    }
}

module.exports = autenticar;
