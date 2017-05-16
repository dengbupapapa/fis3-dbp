const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('use/index/index');
});

module.exports = router;