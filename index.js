const express = require("express")
const path  = require("path");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const cookieParser = require("cookie-parser");

const {models} = require("./database")
const {userModel, dataModel} = models;


const {authmiddleware} = require("./middlewares");
const app = express();
app.use(express.json())
app.use(express.static(__dirname));
app.use(cookieParser());


const credentials = [];
// [ { username : "sohail", password : 123123} ]
const arr = [];
// [ { title : "xetpo", description : "ecommerce", username : "sohail"}]

app.use((req,res,next)=>{
    console.log("middleware..")
    next();
})

app.get("/signUp",(req,res)=>{
    res.sendFile(path.join(__dirname,"./frontend/signUp.html"));
});


app.post("/signUp",async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    // const find = credentials.find(user => user.username === username);
    console.log(username);
    const find = await userModel.findOne({username });


    if(find){
        res.json({ message : "user already exist"});
        return;
    }
    else{ 
        //  credentials.push(req.body);
        await userModel.create({username : username, password : password})
        res.json({
        message : "user created",
        username : req.body.username
        });
    }
        
    
})

app.get("/signIn",(req,res)=>{
    res.sendFile(path.join(__dirname,"./frontend/signIn.html"));
})

app.post("/signIn",async (req,res)=>{
    const {username,password} = req.body;
    // const user = credentials.find(user => user.username === username && user.password === password);
    const user = await userModel.findOne({username : username, password : password});
    if(!user){
        res.send({ message : "invalid crendetials"});
        return;
    }
    const cookie = jwt.sign({
        username : username
    }, "my-secret-key");
    
    
    res.cookie("token", cookie);
    res.json({
        messgage : "login successful",
        "token-cookie" : cookie
    });
    
})


app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname,"./frontend/home.html"));
});




app.post("/add",authmiddleware,async (req,res)=>{
   const username = req.username; 
//    console.log(req.body); 
   const note= req.body;

   // if title or description is empty, even though it is taking as the object
   if(!note.title || !note.description){
    res.status(400).json({
        message : "title and description are required"
    });
    return;
   }
 
//    arr.push({note, username});
//    console.log(arr);
   await dataModel.insertOne({ title : note.title, description : note.description, username : username})
   res.json({
    message : "Done"
   }) 
    
})

app.get("/get",authmiddleware,async (req,res)=>{
   
   const username = req.username;   
//    console.log(arr);     
//    const notes = arr.filter(note => note.username === username).map(note =>  note.note); 
   const notes = await dataModel.find({ username : username});
   console.log("notes : ", notes) // array of notes [  { title: 'xepto', description: 'ecommerce' }]
    res.send(notes);
});

app.put("/edit/:title",authmiddleware,async (req,res)=>{
    const username = req.username;
    const newtitle = req.body.title;
    const newdescription = req.body.description;
    const title = req.params.title;

    // const find = arr.find(obj => obj.note.title == title);
    // console.log(find);
    // find.note.title = newtitle;
    // find.note.description = newdescription;

    const find = await dataModel.findOneAndUpdate({ title : title}, {
        title : newtitle,
        description : newdescription
    });
    

    console.log(find);
    

    res.send({
        message : "updated"
    })

})

app.delete("/delete/:title",authmiddleware,async (req,res)=>{
    const username = req.username;
    const title = req.params.title;
    if(!title){
        return res.send({ message : "cannot be deleted"});
    }
    // const find = arr.find(obj => obj.note.title == title);
    // arr.pop(find);
    // console.log(arr);
    await dataModel.deleteOne({ title : title });
    res.send({message : "item delted"});
    
})


app.listen(3000,() => console.log("server is listening"));