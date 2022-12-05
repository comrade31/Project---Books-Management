const jwt = require('jsonwebtoken')
const bookModel = require("../Model/bookModel")

//============================// authentication //============================

const authentication = async function(req, res, next){
    try {
        const token = req.headers["x-api-key"]
        if(!token){
            res.status(400).send({status: false, message: "token must be present in request headers"})
        }
        jwt.verify(token, "functionup-secret-key", (error, decoded)=> {
            if(error){
                return res.status(401).send({status: false, message: error.message})
            }
            else{  
                req.decoded = decoded
                return next()   
            }
        })
    } catch (error) {
        res.status(500).send({status: false, message: "Authentication failure", message: error.message})
    }
}


module.exports.authentication = authentication