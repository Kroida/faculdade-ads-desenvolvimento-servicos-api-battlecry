const jwt = require("jsonwebtoken");

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
        return res.status(401).json({
            erro: "Token inválido"
        });
    }
}

module.exports = autenticar;