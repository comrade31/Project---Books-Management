const bookModel = require("../Model/bookModel")
const userModel = require("../Model/userModel")
const reviewModel = require("../Model/reviewModel")
const { isIdValid, isValidString, isValidISBN, isValidDate, isValidName,isValidImage } = require("../validators/validator")


//<<<<<<<<------------------- Create-Book -------------------->>>>>>>>>>>>>

const createBook = async function (req, res) {
    try {
        const data = req.body

        // Validaton for Body -
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "please enter some data in request body" })
        }
        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt,bookCover } = data
        // Validaton for Title -
        if (!title) return res.status(400).send({ status: false, message: "Title must requied !" })
        if (!isValidString(title) || !isValidName(title)) return res.status(400).send({ status: false, message: "Please Enter valid Title" })
        let checkTitle = await bookModel.findOne({ title: title })
        if (checkTitle) return res.status(400).send({ status: false, message: "title is already exist" })

        // Validaton for bookCover -
        if (!isValidImage(bookCover)) return res.status(400).send({ status: false, message: "Please Enter valid image url" })

        // Validaton for Excerpt -
        if (!excerpt) return res.status(400).send({ status: false, message: "excerpt must requied !" })
        if (!isValidString(excerpt) || !isValidName(excerpt)) return res.status(400).send({ status: false, message: "Please Enter valid excerpt" })

        // Validaton for UserId -
        if (!userId) return res.status(400).send({ status: false, message: "please enter userId" })
        if (!isIdValid(userId)) return res.status(400).send({ status: false, message: "please enter valid userId" })

        // AUTHORIZATION -
        let userData = await userModel.findById(userId)
        if (!userData) return res.status(404).send({ status: false, message: "no user found" })
        let checkUserId = req.decoded.userId
        if (userData._id.toString() !== checkUserId) return res.status(403).send({ status: false, message: "user is not authorized" })

        // Validaton for ISBN -
        if (!ISBN) return res.status(400).send({ status: false, message: " ISBN must required !" })
        if (!isValidISBN(ISBN)) return res.status(400).send({ status: false, message: "please enter valid ISBN" })
        let checkISBN = await bookModel.findOne({ ISBN: ISBN })
        if (checkISBN) return res.status(400).send({ status: false, message: "ISBN already exist in Db" })

        // Validaton for Category -
        if (!category) return res.status(400).send({ status: false, message: "Category must required !" })
        if (!isValidString(category) || !isValidName(category)) return res.status(400).send({ status: false, message: "please enter valid Category" })

        // Validaton for Subcategory -
        if (!subcategory) return res.status(400).send({ status: false, message: "Subcategory Must reqired !" })
        if (!isValidString(subcategory) || !isValidName(subcategory)) return res.status(400).send({ status: false, message: "please enter Valid subcategory" })

        // Validaton for RelesedAt -
        if (!releasedAt) return res.status(400).send({ status: false, message: "releasedAt Must required !" })
        if (!isValidDate(releasedAt)) return res.status(400).send({ status: false, message: "Please Enter valid releasedAt" })

        const result = await bookModel.create(data)
        res.status(201).send({ status: true, message: "Success", data: result })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


//<<<<<<<<------------------- Get-Book && Filter -------------------->>>>>>>>>>>>>

const getBookDetails = async function (req, res) {
    try {
        let queries = req.query;
    
        const bookData = await bookModel.find({
            $and: [{ isDeleted: false }, queries ],
        }).select({ ISBN: 0, subcategory: 0, isDeleted: 0, deletedAt: 0, createdAt: 0, updatedAt: 0, __v: 0 }).collation({ locale: "en" }).sort({ title: 1 });

        if (bookData.length == 0) return res.status(404).send({ status: false, message: "no book found" })

        res.status(200).send({ status: true, message: "Books list", data: bookData })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//<<<<<<<<------------------- Get Book by Params -------------------->>>>>>>>>>>>>

const getBookByParams = async function (req, res) {
    try {
        let bookId = req.params.bookId

        if (!isIdValid(bookId)) {
            return res.status(400).send({ status: false, message: "Invalid Book-Id !" })
        }
        // finding Books -
        const findBook = await bookModel.findOne({ _id: bookId , isDeleted:false }).select({ __v: 0, deletedAt: 0, ISBN: 0 })
        if (!findBook) {
            return res.status(404).send({ status: false, message: "No Book found !" })
        }

        // finding Review -
        const findReview = await reviewModel.find({ bookId: bookId , isDeleted:false})
        let finalData = findBook._doc;
        finalData.reviewData = findReview
        return res.status(200).send({ status: true, message: "Books list", data: finalData })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


//<<<<<<<<------------------- Update-Book -------------------->>>>>>>>>>>>>

const updateBook = async function (req, res) {
    try {
        const bookId = req.params.bookId
        if (!bookId) return res.status(400).send({ status: false, message: "BookId is required" })
        if (!isIdValid(bookId)) return res.status(400).send({ status: false, message: "Invalid BookId" })
        // AUTHORIZATION-
        let bookData = await bookModel.findById({ _id: bookId, isDeleted: false })
        if (!bookData) return res.status(404).send({ status: false, message: "no book found" })
        let checkUserId = bookData.userId
        if (checkUserId.toString() !== req.decoded.userId) return res.status(403).send({ status: false, message: "you dont have access" })

        const data = req.body
        const { title, excerpt, releasedAt, ISBN } = data

        // Validaton for body -
        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "please provide data for updation" })

        // Validaton for Title -
        if (title) {
            if (!isValidName(title) || isValidString(title) == false) return res.status(400).send({ status: false, message: "please enter a valid Title" })
        }
        let uniqueTitle = await bookModel.findOne({ title: title })
        if (uniqueTitle) return res.status(400).send({ status: false, message: "title entered is not unique" })

        // Validaton for Excerpt -
        if (excerpt) {
            if (!isValidName(excerpt) || !isValidString(excerpt)) return res.status(400).send({ status: false, message: "please enter a valid excerpt" })
        }
        // Validaton for ReleasedAt -
        if (releasedAt) {
            if (!isValidDate(releasedAt)) return res.status(400).send({ status: false, message: "please enter releasedAt in a valid Date format" })
        }
        // Validaton for ISBN -
        if (ISBN) {
            if (isValidISBN(ISBN) == false) return res.status(400).send({ status: false, message: "please enter a valid ISBN" })
        }
        let uniqueISBN = await bookModel.findOne({ ISBN: ISBN })
        if (uniqueISBN) return res.status(400).send({ status: false, message: "ISBN entered is not unique" })
        
        // Find Book and Update-
        const updateData = await bookModel.findOneAndUpdate(
            { _id: bookId, isDeleted: false },
            {
                title: title,
                excerpt: excerpt,
                releasedAt: releasedAt,
                ISBN: ISBN
            },
            { new: true }
        )
        if (!updateData) return res.status(404).send({ status: false, message: "No Book found for updation" })
        return res.status(200).send({ status: true, message: "Success", data: updateData })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


//<<<<<<<<------------------- Delete Book by Params -------------------->>>>>>>>>>>>>

const deleteBook = async function (req, res) {
    try {
        const bookId = req.params.bookId

        if (!bookId) {
            return res.status(400).send({ status: false, message: "bookId is required." })
        }
        if (!isIdValid(bookId)) {
            return res.status(400).send({ status: false, message: "bookId is not valid!" })
        }

        const bookDetails = await bookModel.findById({ _id: bookId, isDeleted: false })
        if (!bookDetails) return res.status(404).send({ status: false, message: "no book found" })
        // AUTHORIZATION
        let checkUserId = bookDetails.userId
        if (checkUserId.toString() !== req.decoded.userId) return res.status(403).send({ status: false, message: "you dont have access" })

        const deleteData = await bookModel.findOneAndUpdate(
            { _id: bookId, isDeleted: false },
            {
                $set: { isDeleted: true, deletedAt: Date.now() }
            })
        if (!deleteData) return res.status(404).send({ status: false, message: "No book found for deletion" })
        return res.status(200).send({ status: true, message: "book deleted succesfully", })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


module.exports.createBook = createBook
module.exports.getBookDetails = getBookDetails
module.exports.updateBook = updateBook
module.exports.getBookByParams = getBookByParams
module.exports.deleteBook = deleteBook
