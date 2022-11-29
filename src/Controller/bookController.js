const bookModel = require("../Model/bookModel")
const userModel = require("../Model/userModel")
const { isIdValid, isValidString, isValidISBN, isValidDate, isValidName } = require("../validators/validator")

const createBook = async function (req, res) {
    try {
        const data = req.body
        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "please enter some data in request body" })
        }
        if (!title || !isValidString(title)) return res.status(400).send({ status: false, msg: "please enter title and should be string" })
        let checkTitle = await bookModel.findOne({ title: title })
        if (checkTitle) return res.status(400).send({ status: false, msg: "title is already exist" })

        if (!excerpt || !isValidString(excerpt)) return res.status(400).send({ status: false, msg: "please enter excerpt and should be string" })

        if (!userId) return res.status(400).send({ status: false, msg: "please enter userId" })
        if (!isIdValid(userId)) return res.status(400).send({ status: false, msg: "please enter valid userId" })

        if (!ISBN || !isValidString(ISBN)) return res.status(400).send({ status: false, msg: "please enter ISBN and should be string" })
        if (!isValidISBN) return res.status(400).send({ status: false, msg: "please enter valid ISBN" })
        let checkISBN = await bookModel.findOne({ ISBN: ISBN })
        if (checkISBN) return res.status(400).send({ status: false, msg: "ISBN is already exist" })

        if (!category || !isValidString(category)) return res.status(400).send({ status: false, msg: "please enter category and should be string" })

        if (!subcategory || !isValidString(subcategory)) return res.status(400).send({ status: false, msg: "please enter subcategory and should be string" })

        if (!releasedAt || !isValidDate(releasedAt)) return res.status(400).send({ status: false, msg: "please enter releasedAt and should be format" })

        const result = await bookModel.create(data)
        res.status(201).send({ status: true, data: result })

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

/*****************************************Get Book Details**********************************************************/
const getBookDetails = async function (req, res) {
    try {
        let queries = req.query;

        const bookData = await bookModel.find({
            $and: [{ isDeleted: false }, queries],
        }).select({ ISBN: 0, subcategory: 0, isDeleted: 0, deletedAt: 0, createdAt: 0, updatedAt: 0, __v: 0 }).collation({ locale: "en" }).sort({ title: 1 });

        if (bookData.length == 0) return res.status(404).send({ status: false, message: "no document found" })

        res.status(200).send({ status: true, message: "Book List", data: bookData })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


/*************************************UpdateBook**************************************************/

const updateBook = async function (req, res) {
    try {
        const bookId = req.params.bookId
        if (!bookId) return res.status(400).send({ status: false, msg: "BookId is required" })
        if (!isIdValid(bookId)) return res.status(400).send({ status: false, message: "Invalid BookId" })

        const data = req.body
        const { title, excerpt, releasedAt, ISBN } = data

        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: "please provide data for updation" })

        if (title) {
            if (!isValidName(title) || isValidString(title) == false) return res.status(400).send({ status: false, msg: "please enter a valid Title" })
        }
        if (excerpt) {
            if (!isValidName(excerpt) || !isValidString(excerpt)) return res.status(400).send({ status: false, message: "please enter a valid excerpt" })
        }
        if (releasedAt) {
            if (!isValidDate(releasedAt)) return res.status(400).send({ status: false, message: "please enter releasedAt in a valid Date format" })
        }
        if (ISBN) {
            if (isValidISBN(ISBN) == false) return res.status(400).send({ status: false, message: "please enter a valid ISBN" })
        }

        let uniqueData = await bookModel.find({ $or: [{ title: title }, { ISBN: ISBN }] })
        if (uniqueData.length !== 0) return res.status(400).send({ status: false, message: "title or ISBN entered is not unique" })

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
        if (!updateData) return res.status(404).send({ status: false, message: "No Book found" })
        return res.status(200).send({ status: true, message: "data succesfully created", data: updateData })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports.createBook = createBook
module.exports.getBookDetails = getBookDetails
module.exports.updateBook = updateBook