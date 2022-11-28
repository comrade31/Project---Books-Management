const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const route = require("./routes/route")
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("...link..",{useNewUrlParser:true})

.then(() => console.log("MongoDb Connected"))
.catch((error) => console.log(error))

app.use( (req ,res) => {
    res.status(404).send({status : false , message :`Page Not Found , Given URL ${req.url} is incorrect for this application.`})
})


app.listen(3000,function(){ console.log("connected to Port 3000");})

app.use('/',route)