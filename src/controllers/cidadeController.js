const cidadeService = require("../services/cidadeService");

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

module.exports = {
    criar,
    listar
};