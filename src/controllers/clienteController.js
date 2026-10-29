const clienteService = require("../services/clienteService");
const BadRequestError = require("../errors/BadRequestError");

async function criar(req, res, next) {
    try {
        const cliente = await clienteService.criarCliente(req.body);

        return res.status(201).json(cliente);
    } catch (error) {
        next(error);
    }
}

async function listar(req, res) {
    const clientes = await clienteService.listarClientes();

    return res.status(200).json(clientes);
}

async function buscarPorId(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            throw new BadRequestError("ID inválido");
        }

        const cliente = await clienteService.buscarCliente(id);

        return res.status(200).json(cliente);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    criar,
    listar,
    buscarPorId
};
