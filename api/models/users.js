const mongoose = require('mongoose'),
			bcrypt = require('bcrypt'),
			saltRounds = 10;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: {
		type: String,
		trim: true,
		required: true,
	},
	email: {
		type: String,
		trim: true,
		required: true,
		unique : true
	},
	phone: {
		type: String,
		trim: true,
		required: true
	},
	age: {
		type: String,
		trim: true,
		required: true
	},
	password: {
		type: String,
		trim: true,
		required: true
	},
	favoriteBooks: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Favorite'
		}
	]
});

UserSchema.pre('save', function(next){
	this.password = bcrypt.hashSync(this.password, saltRounds);
	next();
});

module.exports = mongoose.model('User', UserSchema);
