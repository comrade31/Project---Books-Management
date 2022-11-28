const mongoose = require('mongoose')

//=========================// isValidEmail //===================================

const isValidEmail = function (value) {
  let emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/;
  if (emailRegex.test(value)) return true;
};


//============================// idCharacterValid //============================

const isIdValid = function (value) {
  return mongoose.Types.ObjectId.isValid(value); 
};

//==========================// isValidString //==================================

const isValidString = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

//==============================// isValidName //===============================

const isValidName = function (name) {
  if (/^[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/.test(name)) {
    return true;
  }
};

//==============================// isValidMobile //===============================

const isValidMobile = function (mobile) {
 if (/^[0]?[789]\d{9}$/.test(mobile)){
    return true
 }
}

//==============================// isValidPincode //===============================

const isValidPincode = function (pincode) {
    if (/^[1-9][0-9]{5}$/.test(pincode)){
       return true
    }
   }


//==============================// isValidPassword //===============================

   const isValidPassword = function (pwd) {
    let passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/;
  
    if (passwordRegex.test(pwd)) {
      return true;
    } else {
      return false;
    }
  };
//=============================// module exports //==============================

module.exports = { isValidEmail, isIdValid, isValidString,isValidPassword,isValidName,isValidMobile,isValidPincode}