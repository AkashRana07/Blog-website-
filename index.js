const express=require("express");
const app=express();
let port=3000;
var methodOverride = require('method-override');
app.set("view engine","ejs");
const path=require("path");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));
const mongoose = require('mongoose');
async function mongo(){
    await mongoose.connect('mongodb://127.0.0.1:27017/test')
    .then((res)=>{
        console.log("connected")
    })
}
mongo();
app.listen(port,()=>{
    console.log("working!");
})
const schema=mongoose.Schema({topic:String,title:String,content:String});
const data=mongoose.model("data",schema);
app.get("/posts",async(req,res)=>{
    let posts= await data.find();
    res.render("index.ejs",{posts});
})
app.get("/posts/:id",async (req,res)=>{
    let {id}=req.params;
    let post= await data.findOne({_id:`${id}`});
    res.render("show.ejs",{post});
    
})
app.get("/post/new",(req,res)=>{
    res.render("write.ejs");
})
app.post("/posts",(req,res)=>{
    let {topic,title,content}=req.body;
    const p={topic,title,content};
    const newpost=new data(p);
    newpost.save();
    console.log(p);
    res.redirect("/posts");
})
app.get("/posts/delete/:id",async(req,res)=>{
    let {id}=req.params;
    await data.deleteOne({_id:`${id}`});
    res.redirect("/posts");

})
