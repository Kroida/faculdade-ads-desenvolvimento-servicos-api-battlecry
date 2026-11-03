const categoriaService = require("../services/categoriaService");
const { validarId } = require("../utils/validationUtils");

async function criar(req, res, next) {
    try {
        const categoria = await categoriaService.criarCategoria(req.body);
        return res.status(201).json(categoria);
    } catch (error) {
        next(error);
    }
}

async function listar(req, res, next) {
    try {
        const categorias = await categoriaService.listarCategorias();
        return res.status(200).json(categorias);
    } catch (error) {
        next(error);
    }
}

async function atualizar(req, res, next) {
    try {
        const id = validarId(req.params.id);
        const categoria = await categoriaService.atualizarCategoria(id, req.body);
        return res.status(200).json(categoria);
    } catch (error) {
        next(error);
    }
}

async function deletar(req, res, next) {
    try {
        const id = validarId(req.params.id);
        await categoriaService.deletarCategoria(id);
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
