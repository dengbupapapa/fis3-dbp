const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('use/index/index', {
        addFilter: 'asdasdasjdhjkashdjkashdkjsah邓世伟'
    });
});

module.exports = router;