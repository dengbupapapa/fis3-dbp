const express = require('express');
const router = express.Router();

router.get('/demo2', (req, res, next) => {
    res.render('use/demo2/demo2');
});

module.exports = router;