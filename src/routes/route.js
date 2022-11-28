const express = require("express")
const router = express.Router();
const userController =  require ("../controller/userController")
// const bookController = require ("../controller/bookController")
// const reviewController = require ("../controller/reviewController")


router.post("/register",userController.createUser)

module.exports = router;