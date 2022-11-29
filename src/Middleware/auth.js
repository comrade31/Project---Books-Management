const jwt = require('jsonwebtoken')
const bookModel = require("../Model/bookModel")

//============================// authentication //============================

const authentication = async function(req, res, next){
    try {
        const token = req.headers["x-api-key"]
        if(!token){
            res.status(401).send({status: false, message: "token must be present in request headers"})
        }
        jwt.verify(token, "functionup-secret-key",
        {expiresIn: '3m'}, (err, decode)=> {
            if(err){
                return res.status(400).send({status: false, message: "incorrect token"})
            }
            (decode == true)
            next()
        })
    } catch (error) {
        res.status(500).send({status: false, message: "Authentication failure", message: error.message})
    }
}

//============================// authorisation //============================

const authorisation = async function(req, res, next){
  try{  
    let decodeToken = jwt.verify(token, "functionup-secret-key",
    {expiresIn: '3m'})

    if(!decodeToken){
        return res.status(400).send({status: false, message: "please enter valid token"})
    }

    if(req.query.bookId){
        let result = await bookModel.findById({_id:bookId})
        if(!result){
            return res.status(404).send({status: false, message: " data is not exist of this id"})
        }
        if(decodeToken.userId !== result.userId.toString()){
            res.status(403).send({status: false, message: "user is not authorized"})
        }else{
            next
        }
    }
}catch(err){
    res.status(500).send({status: false, message: err.message})
}
}





module.exports.authentication = authentication
module.exports.authorisation = authorisation