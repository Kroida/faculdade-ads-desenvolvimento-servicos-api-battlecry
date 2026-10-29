const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const clienteRepository = require("../repositories/clienteRepository");

const BadRequestError = require("../errors/BadRequestError");

async function login(email, senha) {
    const usuario = await clienteRepository.buscarPorEmail(email);

    if (!usuario) {
        throw new BadRequestError("Email ou senha inválidos");
    }

    const senhaValida = await bcrypt.compare(
        senha,
        usuario.senha
    );

    if (!senhaValida) {
        throw new BadRequestError("Email ou senha inválidos");
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