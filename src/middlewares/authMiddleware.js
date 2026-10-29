const jwt = require("jsonwebtoken");

const UnauthorizedError = require("../errors/UnauthorizedError");

function autenticar(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({
            erro: "Token não informado"
        });
    }

    const [, token] = authorization.split(" ");

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