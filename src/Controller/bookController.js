const bookModel = require("../Model/bookModel")
const userModel = require("../Model/userModel")
const { isIdValid, isValidString, isValidISBN, isValidDate } = require("../validators/validator")

const createBook = async function (req, res) {
    try {
        const data = req.body
        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "please enter data" })
        }
        if (!title || isValidString(title) == false) return res.status(400).send({ status: false, msg: "please enter title and should be string" })
        let checkTitle = await bookModel.findOne({ title: title })
        if (checkTitle) return res.status(400).send({ status: false, msg: "title is already exist" })

        if (!excerpt || isValidString(excerpt) == false) return res.status(400).send({ status: false, msg: "please enter excerpt and should be string" })

        if (!userId) return res.status(400).send({ status: false, msg: "please enter userId" })
        if (!isIdValid(userId)) return res.status(400).send({ status: false, msg: "please enter valid userId" })

        if (!ISBN || isValidString(ISBN) == false) return res.status(400).send({ status: false, msg: "please enter ISBN and should be string" })
        if (isValidISBN == false) return res.status(400).send({ status: false, msg: "please enter valid ISBN" })
        let checkISBN = await bookModel.findOne({ ISBN: ISBN })
        if (checkISBN) return res.status(400).send({ status: false, msg: "ISBN is already exist" })

        if (!category || isValidString(category) == false) return res.status(400).send({ status: false, msg: "please enter category and should be string" })

        if (!subcategory || isValidString(subcategory) == false) return res.status(400).send({ status: false, msg: "please enter subcategory and should be string" })

        if (!releasedAt || isValidDate(releasedAt) == false) return res.status(400).send({ status: false, msg: "please enter releasedAt and should be format" })

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
        }).select({ ISBN: 0, subcategory: 0, isDeleted: 0, deletedAt: 0,createdAt:0, updatedAt:0 , __v:0}).sort({ title: 1 });

        if (Object.keys(bookData).length == 0) return res.status(404).send({ status: false, message: "no document found" })

        res.status(200).send({ status: true, message: "Book List", data: bookData })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.createBook = createBook
module.exports.getBookDetails = getBookDetails