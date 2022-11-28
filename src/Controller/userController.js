const userModel = require("../Model/userModel")
const { isValidString, isValidName, isValidMobile, isValidEmail, isValidPassword, isValidPincode } = require("../validators/validator")


//<<<<<<<<------------------- Create-User -------------------->>>>>>>>>>>>>

const createUser = async function (req, res) {
    try {
        let userData = req.body
        let { title, name, phone, email, password } = userData

        // Validaton for Body -
        if (Object.keys(userData).length === 0) {
            return res.status(400).send({ status: false, message: "Body should not be Empty" })
        }

        // Validaton for Title -
        if (!title) {
            return res.status(400).send({ status: false, message: "Tilte must reqired !" })
        }
        // Validaton for Name -
        if (!name) {
            return res.status(400).send({ status: false, message: "Name must reqired !" })
        }

        if (!isValidName(name)) {
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
            return res.status(400).send({ status: false, message: "Password Must contain Capial-letter,Small-letter,Special-character Minumum-length-8 and Maximum-15  !" })
        }

        // Validaton for Address -
        if (userData.address.city) {
            if (!isValidName(userData.address.city)) {
                return res.status(400).send({ status: false, message: "Enter Valid City !" })
            }
        }
        if (userData.address.pincode) {
            if (!isValidPincode(userData.address.pincode)) {
                return res.status(400).send({ status: false, message: "Enter Valid Pincode !" })
            }
        }

        const createUser = await userModel.create(userData)
        res.status(201).send({ status: true, message: 'Success', data: createUser })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}
module.exports = { createUser }


