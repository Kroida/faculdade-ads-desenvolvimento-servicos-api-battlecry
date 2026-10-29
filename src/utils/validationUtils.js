const BadRequestError = require("../errors/BadRequestError");

function validarId(valor, nome = "ID") {
    const id = Number(valor);

    if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestError(`${nome} inválido`);
    }

    return id;
}

module.exports = {
    validarId
};
