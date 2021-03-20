var express = require('express'),
    router = express.Router();

router.get('/', (req, res, next) => res.send('upload videos to kaltura API'));

module.exports = router;
