const bookModel = require("../Model/bookModel")
const userModel = require("../Model/userModel")
const reviewModel = require("../Model/reviewModel")
const { isIdValid, isValidString, isValidISBN, isValidDate, isValidName } = require("../validators/validator")

const createBook = async function (req, res) {
    try {
        const data = req.body
        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "please enter some data in request body" })
        }
        if (!title) return res.status(400).send({ status: false, message: "Title must requied !" })
        if (!isValidString(title)) return res.status(400).send({ status: false, message: "Please Enter valid Title" })
        let checkTitle = await bookModel.findOne({ title: title })
        if (checkTitle) return res.status(400).send({ status: false, message: "title is already exist" })

        if (!excerpt ) return res.status(400).send({ status: false, message: "excerpt must requied !" })
        if (!isValidString(excerpt)) return res.status(400).send({ status: false, message: "Please Enter valid excerpt" })

        if (!userId) return res.status(400).send({ status: false, message: "please enter userId" })
        if (!isIdValid(userId)) return res.status(400).send({ status: false, message: "please enter valid userId" })

        if (!ISBN) return res.status(400).send({ status: false, message: " ISBN must required !" })
        if (!isValidISBN(ISBN)) return res.status(400).send({ status: false, message: "please enter valid ISBN" })
        let checkISBN = await bookModel.findOne({ ISBN: ISBN })
        if (checkISBN) return res.status(400).send({ status: false, message: "ISBN is already exist" })

        if (!category ) return res.status(400).send({ status: false, message: "Category must required !" })
        if (!isValidString(category)) return res.status(400).send({ status: false, message: "please enter valid Category" })

        if (!subcategory ) return res.status(400).send({ status: false, message: "Subcategory Must reqired !" })
        if(!isValidString(subcategory)) return res.status(400).send({ status: false, message: "please enter Valid subcategory" })

        if (!releasedAt) return res.status(400).send({ status: false, message: "releasedAt Must required !" })
        if (!isValidDate(releasedAt)) return res.status(400).send({ status: false, message: "Please Enter valid releasedAt" })

        const result = await bookModel.create(data)
        res.status(201).send({data: result })

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

//<<<<<<<<------------------- Get Book by Params -------------------->>>>>>>>>>>>>

const  getBookByParams = async function (req, res) {
    let bookId = req.params.bookId

   if(!isIdValid(bookId)){
     return  res.status(400).send({status:false,message:"Invalid Book-Id !"})
   }
// finding Books -
const findBook = await bookModel.findOne({_id:bookId})
if(!findBook){
return res.status(400).send({status:false,msg:"No Book found !"})

// finding Review -
// const findReview = await reviewModel.findOne({_id:bookId})
}
let finalData = {findBook,reviewsData:[]}
return res.status(200).send({staus:true,message:"Book-list",data:finalData})
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


//<<<<<<<<------------------- Delete Book by Params -------------------->>>>>>>>>>>>>

const deleteBook = async function (req, res) {
    try {
        const bookId = req.params.bookId
      
        if (!bookId) {
            return res.status(400).send({ status: false, msg: "bookId is required." })
        }
        if (!isIdValid(bookId)) {
            return res.status(400).send({ status:false,msg:"bookId is not valid!" })
        }
        const bookDetails = await bookModel.findById(bookId)
        if (!bookDetails) {
            return res.status(404).send({ status: false, msg: "No data found!" })
        }
        
        if (bookDetails.isDeleted == true) {
            return res.status(404).send({ status: false, msg: "No book found!" })
        }
        const deleteData = await bookModel.updateOne({ _id: bookId }, { $set: { isDeleted: true } }, { new: true })
        return res.status(200).send({ status: true, msg: "book deleted succesfully", })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


module.exports.createBook = createBook
module.exports.getBookDetails = getBookDetails
module.exports.updateBook = updateBook
module.exports.getBookByParams = getBookByParams
module.exports.deleteBook = deleteBook