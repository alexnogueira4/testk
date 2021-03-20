// const bcrypt = require('bcrypt')

const KalturaClient = require('../../config/kalturaClient')
var formidable = require('formidable')
const AsyncMiddleware = require('../interfaces/AsyncMiddleware');
// kaltura.enums = require('./KalturaTypes');

const { StatusCodes } = require('http-status-codes');

module.exports = {

	get: AsyncMiddleware(async ctx => {
		const kalturaClient = new KalturaClient();
		await kalturaClient.start()

		// ctx.res.send('ta funcionando')
	}),

	create: AsyncMiddleware(async ctx => {
		const form = formidable({ multiples: true });
		const kalturaClient = new KalturaClient();
		await kalturaClient.start()

		form.parse(ctx, async (err, fields, { files }) => {
			if (err) ctx.next(err);

			try {
				let uploadedFiles = await kalturaClient.uploadVideo({ files, fields })

				ctx.res.status(StatusCodes.OK).json({
					status_code: StatusCodes.OK,
					message: "Video uploaded successfully",
					files: uploadedFiles.files,
					errors: uploadedFiles.errors
				});
			} catch (error) {
				ctx.next(error)
			}
		});
	}),

	// getAll: function (req, res, next) {
	// 	userModel.find().select('-favoriteBooks -password -__v')
	// 		.then(users => {
	// 			res.json({ status:"success", message: "Users list", data: { users } });
	// 		})
	//   	.catch(e => next(e))
	// },

	// getProfile: async (req, res, next) => {
	// 	let { name, age, email, phone } = req.user
	// 	res.json({ name, age, email, phone })
	// },

	// update: async (req, res, next) => {
	// 	let { user } = req
	// 	userModel.findByIdAndUpdate(user._id, req.body, (err, user) => {
	// 		if (err) {
	// 			next(err);
	// 		} else {
	// 			res.json({ status:"success", message: "Data updated successfully" });
	// 		}
	// 	});
	// },

	// delete: async (req, res, next) => {
	// 	let { user } = req

	// 	userModel.findByIdAndRemove(user._id, (err, user) => {
	// 		if(err) {
	// 			next(err);
	// 		} else {
	// 			res.json({ status:"success", message: "Data deleted successfully" });
	// 		}
	// 	});
	// }
}
