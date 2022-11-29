const express = require("express")
const router = express.Router();
const userController =  require ("../controller/userController")
 const bookController = require ("../controller/bookController")
// const reviewController = require ("../controller/reviewController")
const middleware = require("../Middleware/auth")


router.post("/register",  userController.createUser)

router.post("/login", userController.loginUser)

router.post("/books", middleware.authentication,  bookController.createBook)

router.get("/books", middleware.authentication,  bookController.getBookDetails)

router.get("/books/:bookId", bookController.getBookByParams)

router.put("/books/:bookId", bookController.updateBook)

router.delete("/books/:bookId",bookController.deleteBook)

module.exports = router;
