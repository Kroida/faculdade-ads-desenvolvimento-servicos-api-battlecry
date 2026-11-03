const cidadeService = require("../services/cidadeService");
const { validarId } = require("../utils/validationUtils");

async function criar(req, res, next) {
    try {
        const cidade = await cidadeService.criarCidade(req.body);
        return res.status(201).json(cidade);
    } catch (error) {
        next(error);
    }
}

async function listar(req, res, next) {
    try {
        const cidades = await cidadeService.listarCidades();
        return res.status(200).json(cidades);
    } catch (error) {
        next(error);
    }
}

async function atualizar(req, res, next) {
    try {
        const id = validarId(req.params.id);
        const cidade = await cidadeService.atualizarCidade(id, req.body);
        return res.status(200).json(cidade);
    } catch (error) {
        next(error);
    }
}

async function deletar(req, res, next) {
    try {
        const id = validarId(req.params.id);
        await cidadeService.deletarCidade(id);
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    criar,
    listar,
    atualizar,
    deletar
};
