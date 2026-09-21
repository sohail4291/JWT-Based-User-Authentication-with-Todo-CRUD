const express = require("express")
const path  = require("path");
const axios = require("./node_modules/axios/index.d.cts");
const jwt = require("jsonwebtoken");
const {authmiddleware} = require("./middlewares");
const app = express();
app.use(express.json())
app.use(express.static(__dirname));


const credentials = [];

app.use((req,res,next)=>{
    console.log("middleware..")
    next();
})

app.get("/signUp",(req,res)=>{
    res.sendFile(path.join(__dirname,"signUp.html"));
});

app.post("/signUp",(req,res)=>{
    const username = req.body.username;
    const find = credentials.find(user => user.username === username);

    if(find){
        res.json({ message : "user already exist"});
        
    }
    else{ 
         credentials.push(req.body);
         console.log("credentials : " + credentials);
        res.json({
        message : "user created",
        username : req.body.username
        });
        
    }
})

app.get("/signIn",(req,res)=>{
    res.sendFile(path.join(__dirname,"signIn.html"));
})

app.post("/signIn",(req,res)=>{
    const {username,password} = req.body;
    const user = credentials.find(i => i.username === username && i.password === password);

    if(!user){
        res.send({ message : "invalid crendetials"});
        return;
    }
    const token = jwt.sign({
        username : username
    }, "my-secret-key");

    console.log(token);
    res.json({
        messgage : "login successful",
        token : token
    });
    
})


app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname,"index.html"));
});

const arr = [];


app.post("/add",authmiddleware,(req,res)=>{
   
   const username = req.username;

   console.log(req.body);
   const note = req.body.body;
   console.log("note : ",note);
   arr.push({note,username});

   res.json({
    message : "Done"
   })

   
    
})

app.get("/get",authmiddleware,(req,res)=>{
   
   const username = req.username;        
   const notes = arr.filter(note => note.username === username).map(note => note.note);
   

   console.log("notes : ",notes)
   res.send(notes);
    }

);



app.listen(3000,() => console.log("server is listening"));