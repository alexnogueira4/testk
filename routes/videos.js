const express = require('express'),
      router = express.Router(),
      videoController = require('../api/controllers/videos')

// /* Create User */
router.post('/', videoController.create);

// /* Log user */
// router.post('/auth', videoController.authenticate);

/* List all users */
router.get('/', videoController.get);
// router.get('/', videoController.getAll);

// router.get('/profile', AuthMiddleware, videoController.getProfile);
// router.put('/', AuthMiddleware, videoController.update);
// router.delete('/', AuthMiddleware, videoController.delete);


module.exports = router;
