const userModel = require("../model/user")

const checkName = /^[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/  //regex for name
const checkPhone = /^[0-9]{10,10}$/   //regex for mobile
const checkEmail = /^[a-z0-9_]{2,}@[gmail]{3,}.[com]{3}$/  //regex for email
const checkAddress = /^[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/  //regex for address
 
 const createUser = async function (req,res) {
    let userData = req.body 
    let {title,name,phone,email,password,address} = Data
   let street = address.street
    let city = address.city
    let pincode = address.pincode

    // Validaton for Body -
    if(Object.keys(userData).length===0){
        return res.status(400).send({status:false,message:"Body should not be Empty"})
        }

   // Validaton for Title -
   if(!title){
    return res.status(400).send({status:false,message:"Tilte must reqired !"})
   }
   // Validaton for Name -
   if(!name){
    return res.status(400).send({status:false,message:"Name must reqired !"})
   }
   if(!checkName.test(name)){
    return res.status(400).send({status:false,message:"Please Enter Valid Name!"})
   }

   // Validaton for Phone -
   if(!phone){
    return res.status(400).send({status:false,message:"phone must reqired !"})
   }
   if(!checkPhone.test(phone)){
    return res.status(400).send({status:false,message:"Please Enter Valid Name!"})
   }
   const searchPhone = await userModel.findOne({phone:phone})
   if(searchPhone){
    return res.status(400).send({status:false,message:"Phone is already exist!"})
}

   // Validaton for Email -
if(!email){
    return res.status(400).send({status:false,message:"email must reqired !"})
   }
   if(!checkEmail.test(email)){
    return res.status(400).send({status:false,message:"Please Enter Valid Email !"})
   }
 const searchEmail = await userModel.findOne({email:email})
   if(searchEmail){
       return res.status(400).send({status:false,message:"Email-Id is already exist!"})
   } 

   // Validaton for Password -
   if(!password){
    return res.status(400).send({status:false,message:"password must reqired !"})
   }
   if(password.length<8){
    return res.status(400).send({status:false,message:"password length minimum 8 !"})
   }
   if(password.length>15){
    return res.status(400).send({status:false,message:"password length maximum 15 !"})
   }

   // Validaton for Address -
   if(!checkAddress.test(address)){
    return res.status(400).send({status:false,message:"Please Enter Valid address !"})
   }
   if(!checkAddress.test(street)){
    return res.status(400).send({status:false,message:"Please Enter Valid street !"})
   }
   if(!checkAddress.test(city)){
    return res.status(400).send({status:false,message:"Please Enter Valid city !"})
   }
   if(!checkAddress.test(pincode)){
    return res.status(400).send({status:false,message:"Please Enter Valid Pincode !"})
   }
 const createUser = await userModel.create(userData)
 res.status(201).send({status:true,message:'Success',data:createUser})
 }

 module.exports={createUser}