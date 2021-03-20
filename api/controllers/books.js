const bookModel = require('../models/books')

module.exports = {
	
	create: function (req, res, next) {
		bookModel.create({
			name: req.body.name,
			isbn: req.body.isbn,
			category: req.body.category,
			year: req.body.year
		}, (err, book) => {
		  if (err) {
		  	next(err)
		  } else {
		  	res.json({ status: "success", message: "Data added successfully", data: { book } });
		  }
		});
	},

	getAll: function (req, res, next) {
		bookModel.find({}, function(err, books){
			if (err){
				next(err);
			} else{
				res.json({ status:"success", message: "Books list", data: { books } });
			}
		})
	},

	getById: function (req, res, next) {
		bookModel.findOne({_id: req.params.bookId }, function(err, book){
			if (err || !book){

				if ((err && !err.reason) && !book) {
					res.json({ status:"success", message: "Book by id", data: { book } });
				} else {
					next(err);
				}

			} else{
				res.json({ status:"success", message: "Book by id", data: { book } });
			}
		})
	},

	update: function(req, res, next) {
		bookModel.findByIdAndUpdate(req.params.bookId, req.body, function(err, book){
			if (err) {
				next(err);
			} else {
				res.json({status:"success", message: "Data updated successfully", data: { book } });
			}
		});
	},

	delete: function (req, res, next) {
		bookModel.findByIdAndRemove(req.params.bookId, (err, user) => {
			if(err) {
				next(err);
			} else {
				res.json({ status:"success", message: "Data deleted successfully" });
			}
		});
	}
}
