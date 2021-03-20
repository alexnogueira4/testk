const userModel = require('../models/users'),
			bcrypt = require('bcrypt'),
			jwt = require('jsonwebtoken'),
			passport = require('passport'),
			config = require("../../config/config.js")

const getToken = _id => jwt.sign({ _id }, config.jwtSecret, config.tokenOptions);

module.exports = {

	create: async (req, res, next) => {
		userModel.create({
			name: req.body.name,
			email: req.body.email,
			phone: req.body.phone,
			age: req.body.age,
			password: req.body.password
		}, (err, result) => {
		  if (err) {
		  	next(err)
		  } else {
				let token = getToken(result._id)
		  	res.json({ status: "success", message: "User added successfully", token });
		  }
		});
	},

	authenticate: async (req, res, next) => {
		passport.authenticate('local', config.jwtSession, (err, user, info) => {
	    if (err || !user) {
	      return res.status(400).json({
	        message: info ? info.message : 'Login failed',
	        user   : user
	      });
	    }

	    req.login(user, config.jwtSession, (err) => {
	      if (err) res.send(err)

				let { _id } = user,
	      		token = getToken(_id)

				res.json({ status: "success", message: "User logged successfully", token });
	    });
	  })
	  (req, res)
	},

	getAll: function (req, res, next) {
		userModel.find().select('-favoriteBooks -password -__v')
			.then(users => {
				res.json({ status:"success", message: "Users list", data: { users } });
			})
	  	.catch(e => next(e))
	},

	getProfile: async (req, res, next) => {
		let { name, age, email, phone } = req.user
		res.json({ name, age, email, phone })
	},

	update: async (req, res, next) => {
		let { user } = req
		userModel.findByIdAndUpdate(user._id, req.body, (err, user) => {
			if (err) {
				next(err);
			} else {
				res.json({ status:"success", message: "Data updated successfully" });
			}
		});
	},
	
	delete: async (req, res, next) => {
		let { user } = req

		userModel.findByIdAndRemove(user._id, (err, user) => {
			if(err) {
				next(err);
			} else {
				res.json({ status:"success", message: "Data deleted successfully" });
			}
		});
	}
}
