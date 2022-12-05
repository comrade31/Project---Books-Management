const userModel = require("../Model/userModel")
const { isValidString, isValidName, isValidMobile, isValidEmail, isValidPassword, isValidPincode } = require("../validators/validator")
const reviewModel = require("../Model/reviewModel")
const jwt = require('jsonwebtoken')


//<<<<<<<<------------------- Create-User -------------------->>>>>>>>>>>>>

const createUser = async function (req, res) {
    try {
        let userData = req.body
        let { title, name, phone, email, password, address } = userData

        // Validaton for Body -
        if (Object.keys(userData).length === 0) {
            return res.status(400).send({ status: false, message: "Body should not be Empty" })
        }
        // Validaton for Title -
        if (!title) {
            return res.status(400).send({ status: false, message: "Title must reqired !" })
        }
        let titles = ["Mr", "Mrs", "Miss"]
        if (!titles.includes(title)) {
            return res.status(400).send({ status: false, message: "Provide a Valid Title !" })
        }
        // Validaton for Name -
        if (!name) {
            return res.status(400).send({ status: false, message: "Name must reqired !" })
        }
        if (!isValidString(name) || !isValidName(name)) {
            return res.status(400).send({ status: false, message: "Please Enter Valid Name!" })
        }
        // Validaton for Phone -
        if (!phone) {
            return res.status(400).send({ status: false, message: "phone must reqired !" })
        }
        if (!isValidMobile(phone)) {
            return res.status(400).send({ status: false, message: "Please Enter Valid Phone !" })
        }
        const searchPhone = await userModel.findOne({ phone: phone })
        if (searchPhone) {
            return res.status(400).send({ status: false, message: "Phone is already exist!" })
        }
        // Validaton for Email -
        if (!email) {
            return res.status(400).send({ status: false, message: "email must reqired !" })
        }
        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "Please Enter Valid Email !" })
        }
        const searchEmail = await userModel.findOne({ email: email })
        if (searchEmail) {
            return res.status(400).send({ status: false, message: "Email-Id is already exist!" })
        }
        // Validaton for Password -
        if (!password) {
            return res.status(400).send({ status: false, message: "password must reqired !" })
        }
        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "Password Must contain atleast one Capial-letter, a special-character Min-length-8 and Maximum-15!" })
        }
        // Validaton for Address -
        if (address) {
           
                if (address.street) {
                    if (!isValidString(userData.address.street)) {
                        return res.status(400).send({ status: false, message: "Enter a valid Street" })
                    }
                }
                if (address.city) {
                    if (!isValidName(userData.address.city)) {
                        return res.status(400).send({ status: false, message: "Enter Valid City !" })
                    }
                }
                if (address.pincode) {
                    if (!isValidPincode(userData.address.pincode)) {
                        return res.status(400).send({ status: false, message: "Enter Valid Pincode !" })
                    }
                }
            } 
        

        const createUser = await userModel.create(userData)
        res.status(201).send({ status: true, message: 'Success', data: createUser })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}


//<<<<<<<<------------------- Login-User -------------------->>>>>>>>>>>>>

const loginUser = async function (req, res) {
    try {
        let email = req.body.email;
        let password = req.body.password;

        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "email and password is required" })
        }
        if (!email) {
            return res.status(400).send({ status: false, message: "email is required" })
        }
        if(!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "email is Invalid" })
        }
        if (!password) {
            return res.status(400).send({ status: false, message: "password is required" })
        }

        let user = await userModel.findOne({ email: email, password: password });
        if (!user) {
            return res.status(400).send({ status: false, message: "email or password is incorrect" });
        }
        let token = jwt.sign({
            userId: user._id.toString()
        }, "functionup-secret-key", { expiresIn: '30m' });

        res.setHeader("x-api-key", token);
        res.status(200).send({ status: true, message: "Success", data: token });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};


module.exports = { createUser, loginUser }


