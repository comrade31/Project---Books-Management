
const bookModel = require("../Model/bookModel")
const userModel = require("../Model/userModel")
const reviewModel = require("../Model/reviewModel")
const { isIdValid, isValidString, isValidISBN, isValidDate, isValidName } = require("../validators/validator")

const deleteReview = async function (req, res) {
    const bookId = req.params.bookId
    const reviewId = req.params.reviewId

    if (!bookId) return res.status(400).send({ status: false, msg: "bookId is required!" })
    if (!isIdValid(bookId)) return res.status(400).send({ status: false, msg: "bookId is not valid!" })

    if (!reviewId) return res.status(400).send({ status: false, msg: "reviewId is required!" })
    if (!isIdValid(reviewId)) return res.status(400).send({ status: false, msg: "reviewId is not valid!" })

    const deleteData = await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId, isDeleted: false }, {
        $set: {
            isDeleted: true,
        }
    })
    if (!deleteData) return res.status(404).send({ status: false, message: "book or book review does not exist" })
    const updateBook = await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } })
    return res.status(200).send({ status: true, msg: "review deleted succesfully", })
}

module.exports.deleteReview = deleteReview