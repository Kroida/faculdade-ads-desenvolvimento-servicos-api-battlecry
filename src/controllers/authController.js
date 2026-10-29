const authService = require("../services/authService");

async function login(req, res, next) {
    try {
        const {email, senha} = req.body;

        const token = await authService.login(email, senha);

        return res.status(200).json({
            token: token
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    login
};