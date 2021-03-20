const FavoriteModel = require('../models/favorites'),
			UserModel = require('../models/users');

module.exports = {

	create: async (req, res, next) =>{
		let { user } = req,
				{ bookId } = req.body

		let fav = await FavoriteModel.create({
			user: user._id,
			book: bookId
		})

		await fav.save()

		user.favoriteBooks.push(fav)

		let userById = await UserModel.findOne(user._id);

		userById.favoriteBooks.push(fav);

		await UserModel.findByIdAndUpdate(user._id, user, (err, user) => {
			if (err) {
				next(err);
			} else {
				res.json({ status:"success", message: "Data created successfully" });
			}
		});
	},

	getAll: async (req, res, next) => {
		let id = req.params.userId || req.user._id;

		let favoriteBooks = await FavoriteModel.find({user: id}).populate('book user', '-favoriteBooks -password');

		res.json({ status: "success", message: "Favorite Books list", data: { favoriteBooks } });
	},

	delete: function (req, res, next) {
		FavoriteModel.findByIdAndRemove(req.params.favoriteId, (err, fav) => {
			if(err) {
				next(err);
			} else {
				res.json({ status:"success", message: "Data deleted successfully" });
			}
		});
	}
}
