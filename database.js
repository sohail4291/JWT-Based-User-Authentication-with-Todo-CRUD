const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;
console.log(MONGODB_URI);
mongoose.connect(MONGODB_URI)
.then(() => { console.log("connected successfully")})
.catch((error) => console.log("error : ",error) );


const userSchema = new mongoose.Schema({ username : String, password : String});
const dataSchema = new mongoose.Schema({ title : String, description : String, username : String});

const userModel = mongoose.model("user", userSchema);
const dataModel = mongoose.model("data", dataSchema);

exports.models = { userModel, dataModel };