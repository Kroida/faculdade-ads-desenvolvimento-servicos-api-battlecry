const express = require("express");

const app = express();

app.use(express.json());

// app.get("/", (req, res) => {
//     res.json({
//         mensagem: "BattleCry API funcionando!"
//     });
// });

module.exports = app;
