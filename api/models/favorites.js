const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BookSchema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
	},
	book: {
		type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
	},
});

module.exports = mongoose.model('Favorite', BookSchema)
