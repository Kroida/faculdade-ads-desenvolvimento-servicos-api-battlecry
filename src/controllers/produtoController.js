const produtoService = require("../services/produtoService");
const { validarId } = require("../utils/validationUtils");

async function criar(req, res, next) {
    try {
        const produto = await produtoService.criarProduto(req.body);
        return res.status(201).json(produto);
    } catch (error) {
        next(error);
    }
}

async function listar(req, res, next) {
    try {
        const produtos = await produtoService.listarProdutos();
        return res.status(200).json(produtos);
    } catch (error) {
        next(error);
    }
}

async function buscarPorId(req, res, next) {
    try {
        const id = validarId(req.params.id);
        const produto = await produtoService.buscarProduto(id);

        return res.status(200).json(produto);
    } catch (error) {
        next(error);
    }
}

async function atualizar(req, res, next) {
    try {
        const id = validarId(req.params.id);
        const produto = await produtoService.atualizarProduto(id, req.body);

        return res.status(200).json(produto);
    } catch (error) {
        next(error);
    }
}

async function deletar(req, res, next) {
    try {
        const id = validarId(req.params.id);
        await produtoService.deletarProduto(id);

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    criar,
    listar,
    buscarPorId,
    atualizar,
    deletar
};
