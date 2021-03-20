const express = require('express'),
      router = express.Router(),
      favoriteController = require('../api/controllers/favorites')

/* Get Users favorite books */
router.get('/:userId?', favoriteController.getAll);

/* Create a new favorite registry */
router.post('/', favoriteController.create);

/* Delete a favorite registry */
router.delete('/:favoriteId', favoriteController.delete);

module.exports = router;
