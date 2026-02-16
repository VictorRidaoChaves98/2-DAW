const { Router } = require('express');
const router = Router();

router.get('/ping', (req, res) => {
    res.status(200).send('pong');
});

module.exports = router;
