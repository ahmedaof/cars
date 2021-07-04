const express = require ('express');
const app = express();
const bodyparser = require('body-parser');
const  Mongoose = require('mongoose');


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false}));

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin" , "*");
    res.setHeader("Access-Control-Allow-headers" ,
                   "Origin,X-Requested-With,Content-Type,Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods" ,
                  "GET,DELETE,POST,PUT,PATCH,OPTIONS");
    next();
});

const postRoutes=require("./routes/posts");
const userRoutes=require("./routes/user");

Mongoose.connect("mongodb+srv://yoaqSMGdXN7ONlN1:yoaqSMGdXN7ONlN1@cluster0.wbcru.mongodb.net/angularNode?w=majority", {useNewUrlParser: true})
.then(()=>{
    console.log("connection success");
}).catch((error)=>{
  console.log("connection fail:"+error)
})
const path = require("path");


app.use("/api/posts",postRoutes);
app.use("/api/user",userRoutes);

app.use("/images", express.static(path.join(__dirname,"/images")));

app.listen(process.env.PORT||3000);
console.log("listening to port 3000 ");
module.exports = app;