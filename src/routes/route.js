const express = require("express")
const router = express.Router();
const userController =  require ("../controller/userController")
 const bookController = require ("../controller/bookController")
// const reviewController = require ("../controller/reviewController")
const middleware = require("../Middleware/auth")


router.post("/register", middleware.authentication, userController.createUser)

router.post("/login", userController.loginUser)

router.post("/books", middleware.authentication,  bookController.createBook)

router.get("/books", middleware.authentication,  bookController.getBookDetails)

module.exports = router;
