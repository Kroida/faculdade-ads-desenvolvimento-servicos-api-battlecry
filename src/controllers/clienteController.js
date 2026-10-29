const clienteService = require("../services/clienteService");
const { validarId } = require("../utils/validationUtils");

async function criar(req, res, next) {
    try {
        const cliente = await clienteService.criarCliente(req.body);
        return res.status(201).json(cliente);
    } catch (error) {
        next(error);
    }
}

async function listar(req, res, next) {
    try {
        const clientes = await clienteService.listarClientes();
        return res.status(200).json(clientes);
    } catch (error) {
        next(error);
    }
}

async function buscarPorId(req, res, next) {
    try {
        const id = validarId(req.params.id);
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
