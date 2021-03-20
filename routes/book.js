const express = require('express'),
      router = express.Router(),
      AuthMiddleware = require('../config/passport'),
      bookController = require('../api/controllers/books')

router.get('/', bookController.getAll);
router.get('/:bookId', bookController.getById);
router.post('/', AuthMiddleware, bookController.create);
router.put('/:bookId', AuthMiddleware, bookController.update);
router.delete('/:bookId', AuthMiddleware, bookController.delete);

module.exports = router;
