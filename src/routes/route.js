const express = require("express")
const router = express.Router();
const userController =  require ("../controller/userController")
const bookController = require ("../controller/bookController")
const reviewController = require ("../controller/reviewController")
const middleware = require("../Middleware/auth")
const aws = require("../Controller/awsController")

//<<<<<<<<------------------- User Api -------------------->>>>>>>>>>>>>
router.post("/register",  userController.createUser)

router.post("/login", userController.loginUser)

//<<<<<<<<------------------- Book Api -------------------->>>>>>>>>>>>>
router.post("/books", middleware.authentication, bookController.createBook)

router.post("/write-file-aws",aws.uploadImage)

router.get("/books", middleware.authentication,  bookController.getBookDetails)

router.get("/books/:bookId", bookController.getBookByParams)

router.put("/books/:bookId",middleware.authentication, bookController.updateBook)

router.delete("/books/:bookId",middleware.authentication, bookController.deleteBook)

//<<<<<<<<------------------- Review Api -------------------->>>>>>>>>>>>>
router.post("/books/:bookId/review", reviewController.ceateReview)

router.put("/books/:bookId/review/:reviewId", reviewController.updateReview)

router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview)



module.exports = router;
