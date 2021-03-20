const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BookSchema = new Schema({
	name: {
		type: String,
		trim: true,
		required: true
	},
	isbn: {
		type: String,
		trim: true,
		required: true,
		unique: true
	},
	category: {
		type: String,
		trim: true,
		required: true
	},
	year: {
		type: String,
		trim: true,
		required: true
	}
});

module.exports = mongoose.model('Book', BookSchema)
