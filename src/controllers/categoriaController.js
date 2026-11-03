const categoriaService = require("../services/categoriaService");

async function criar(req, res, next) {
    try {
        const categoria =
            await categoriaService.criarCategoria(req.body);

        return res.status(201).json(categoria);
    } catch (error) {
        next(error);
    }
}

async function listar(req, res, next) {
    try {
        const categorias =
            await categoriaService.listarCategorias();

        return res.status(200).json(categorias);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    criar,
    listar
};