const fibonacciService = require("../utils/fibonacciService");

exports.getFibonacci = (req, res) => {
    const n = parseInt(req.params.n);

    if (isNaN(n) || n < 0) {
        return res.status(400).json({ error: "n debe ser un número entero positivo" });
    }

    const result = fibonacciService(n);
    res.json({ n, result });
};
