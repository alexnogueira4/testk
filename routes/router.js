const { Router } = require('express'),
      index = require('./index'),
      videos = require('./videos'),
      router = Router();

router.use('/', index);
router.use('/videos', videos);

module.exports = router