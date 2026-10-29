const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const clienteRepository = require("../repositories/clienteRepository");

const BadRequestError = require("../errors/BadRequestError");
const UnauthorizedError = require("../errors/UnauthorizedError");

async function login(email, senha) {
    if (!email || !senha) {
        throw new BadRequestError("Email e senha são obrigatórios");
    }

    const usuario = await clienteRepository.buscarPorEmail(email);

    if (!usuario) {
        throw new UnauthorizedError("Email ou senha inválidos");
    }

    const senhaValida = await bcrypt.compare(
        senha,
        usuario.senha
    );

    if (!senhaValida) {
        throw new UnauthorizedError("Email ou senha inválidos");
    }

    const token = jwt.sign(
        {
            id: usuario.id,
            tipo: usuario.tipo
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    return token;
}

module.exports = {
    login
};
