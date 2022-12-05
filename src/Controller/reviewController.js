
const bookModel = require("../Model/bookModel")
const userModel = require("../Model/userModel")
const reviewModel = require("../Model/reviewModel")
const { isIdValid, isValidString, isValidISBN, isValidDate, isValidName, isValidRating } = require("../validators/validator")

//<<<<<<<<------------------- Post Review -------------------->>>>>>>>>>>>>

const ceateReview = async function (req, res) {
    try {
        let Data = req.body
        const { reviewedBy, rating, review } = Data

        // Validation for Params-BookId -
        let bookId = req.params.bookId
        if (!isIdValid(bookId)) {
            return res.status(400).send({ status: false, message: "ParamsBookId is not Valid !" })
        }
        // Validation for reviewedBy -   
        if (!isValidName(reviewedBy)) {
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

        let finalResult = { bookId: bookId, reviewedBy: reviewedBy, reviewedAt: Date.now(), rating: rating, review: review }

        const createReview = await reviewModel.create(finalResult)
        let obj = {}
        obj._id = createReview._id
        obj.bookId = createReview.bookId
        obj.reviewedBy = createReview.reviewedBy
        obj.reviewedAt = createReview.reviewedAt
        obj.rating = createReview.rating
        obj.review = createReview.review

      
        let findBook = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: 1 } })
        if (!findBook) {
            return res.status(404).send({ status: false, message: "No book found !" })
        }
        return res.status(201).send({ status: true, message: "Success", data: obj })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })

    }
}

//<<<<<<<<------------------- update Review -------------------->>>>>>>>>>>>>

const updateReview = async function (req, res) {
    try {
        const bookId = req.params.bookId
        if (!bookId) return res.status(400).send({ status: false, message: "please enter bookId in path params" })
        if (!isIdValid(bookId)) {
            return res.status(400).send({ status: false, message: "ParamsBookId is not Valid !" })
        }
        const bookData = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!bookData) return res.status(404).send({ status: false, message: "bookId is not exist" })

        const reviewId = req.params.reviewId
        if (!reviewId) return res.status(400).send({ status: false, message: "please enter reviewId in path params" })
        if (!isIdValid(reviewId)) {
            return res.status(400).send({ status: false, message: "Params ReviewId is not Valid !" })
        }
        const reviewData = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!reviewData) return res.status(404).send({ status: false, message: "reviewId is not exist" })

        const data = req.body
        const { reviewedBy, rating, review } = data

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "please provide data for updation" })

        if (reviewedBy) {
            if (!isValidName(reviewedBy) || !isValidString(reviewedBy)) return res.status(400).send({ status: false, message: "please enter valid review's name" })
        }

        if (rating) {
            if (!isValidRating(rating)) return res.status(400).send({ status: false, message: "please enter valid rating" })
        }

        if (review) {
            if (!isValidName(review) || !isValidString(review)) return res.status(400).send({ status: false, message: "please enter valid review" })
        }

        const updateReview = await reviewModel.findOneAndUpdate(
            { _id: reviewId, bookId: bookId, isDeleted: false },
            {
                reviewedBy: reviewedBy,
                rating: rating,
                review: review
            }, { new: true }
        )
        if (!updateReview) return res.status(404).send({ status: false, message: "Updation Failed" })
        res.status(200).send({ status: true, message: "Success", data: updateReview })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//<<<<<<<<------------------- Delete Review -------------------->>>>>>>>>>>>>

const deleteReview = async function (req, res) {
    const bookId = req.params.bookId
    const reviewId = req.params.reviewId

    if (!bookId) return res.status(400).send({ status: false, message: "bookId is required!" })
    if (!isIdValid(bookId)) return res.status(400).send({ status: false, message: "bookId is not valid!" })

    if (!reviewId) return res.status(400).send({ status: false, message: "reviewId is required!" })
    if (!isIdValid(reviewId)) return res.status(400).send({ status: false, message: "reviewId is not valid!" })

    const deleteReview = await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId, isDeleted: false }, {
        $set: {
            isDeleted: true,
        }
    })
    if (!deleteReview) return res.status(404).send({ status: false, message: "book or book review does not exist" })
    const updateBook = await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } })
    return res.status(200).send({ status: true, message: "review deleted succesfully", })
}

module.exports.ceateReview = ceateReview
module.exports.deleteReview = deleteReview
module.exports.updateReview = updateReview
