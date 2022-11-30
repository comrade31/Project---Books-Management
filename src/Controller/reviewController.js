
const bookModel = require("../Model/bookModel")
const userModel = require("../Model/userModel")
const reviewModel = require("../Model/reviewModel")
const { isIdValid, isValidString, isValidISBN, isValidDate, isValidName,isValidRating } = require("../validators/validator")

//<<<<<<<<------------------- Post Review -------------------->>>>>>>>>>>>>

const ceateReview = async function (req, res) {
    try {
        let Data = req.body
        const { bookId, reviewedBy, reviewedAt, rating, review, isDeleted } = Data

        // Validation for Params-BookId -
        let paramBookId = req.params.bookId

        if (!isIdValid(paramBookId)) {
            return res.status(400).send({ status: false, message: "ParamsBookId is not Valid !" })
        }
        // Validation for Body BookId -
        if (!bookId) {
            return res.status(400).send({ status: false, message: "bookId Must required in Body !" })
        }
        if (!isIdValid(bookId)) {
            return res.status(400).send({ status: false, message: "Body bookId is not Valid !" })
        }

        // Validation for reviewedBy -
        
        if (!isValidName(reviewedBy)) {
            return res.status(400).send({ status: false, message: "Please Enter Valid reviewedBy !" })
        }

        // Validation for reviewedAt -
        if (!reviewedAt) {
            return res.status(400).send({ status: false, message: "reviewedAt Must required !" })
        }
        if (!isValidDate(reviewedAt)) {
            return res.status(400).send({ status: false, message: "Please Enter Valid reviewedBy !" })
        }

        // Validation for rating -
        if (!rating) {
            return res.status(400).send({ status: false, message: "Rating Must required !" })
        }
        if (!isValidRating(rating)) {
            return res.status(400).send({ status: false, message: "Please Enter Valid Rating Between 1-5 !" })
        }
        // Validation for review -
        if (!isValidName(review)) {
            return res.status(400).send({ status: false, message: "Please Enter Valid review !" })
        }

        // Validation for Params-BookId or Body-BookId same or Not -
        const checkBookId = await bookModel.findOne({ $and: [{ _id: paramBookId }, { isDeleted: false }] })
        if (!checkBookId) {
            return res.status(400).send({ status: false, message: "No book found !" })
        }
        if (bookId != checkBookId._id) {
            return res.status(400).send({ status: false, message: "Review Creating for Wrong-Book !" })
        }
        const createReview = await reviewModel.create(Data)
        return res.status(201).send({ data: createReview })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })

    }
}



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

module.exports.ceateReview = ceateReview
module.exports.deleteReview = deleteReview
