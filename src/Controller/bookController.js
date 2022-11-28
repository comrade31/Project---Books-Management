const bookModel = require("../Model/bookModel")

const { isIdValid, isValidString,isValidISBN, isValidDate } = require("../validators/validator")

const createBook = async function(req, res){
 try{   
    const data = req.body
    const {title, excerpt, userId, ISBN, category,subcategory,releasedAt} = data

    if(Object.keys(data).length == 0){
        return res.status(400).send({status: false, msg: "please enter data"})
    }
    if(!title || isValidString(title) == false)   return res.status(400).send({status: false, msg: "please enter title and should be string"})
    let checkTitle = await bookModel.findOne({title: title})
    if(checkTitle) return res.status(400).send({status: false, msg: "title is already exist"})

    if(!excerpt || isValidString(excerpt) == false) return res.status(400).send({status: false, msg: "please enter excerpt and should be string"})

    if(!userId)  return res.status(400).send({status: false, msg: "please enter userId"})
    if(!isIdValid(userId))  return res.status(400).send({status: false, msg: "please enter valid userId"})

    if(!ISBN || isValidString(ISBN) == false)    return res.status(400).send({status: false, msg: "please enter ISBN and should be string"})
    if(isValidISBN == false) return res.status(400).send({status: false, msg: "please enter valid ISBN"})
    let checkISBN = await bookModel.findOne({ISBN: ISBN})
    if(checkISBN) return res.status(400).send({status: false, msg: "ISBN is already exist"})

    if(!category || isValidString(category) == false) return res.status(400).send({status: false, msg: "please enter category and should be string"})

    if(!subcategory || isValidString(subcategory) == false) return res.status(400).send({status: false, msg: "please enter subcategory and should be string"})

    if(!releasedAt ||  isValidDate(releasedAt) == false) return res.status(400).send({status: false, msg: "please enter releasedAt and should be format"})

     const result = await bookModel.create(data)
     res.status(201).send({status: true, data: result})

}catch(err){
    res.status(500).send({status: false, msg: err.message})
}
}

module.exports.createBook = createBook
