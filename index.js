const express = require("express");
const bodyParser = require("body-parser");
var mongoose = require('mongoose');
const cors = require("cors")
const pdf = require('html-pdf');
const pdfTemplate = require('./documents')
var multer  = require('multer')
const path = require('path');
var base64Img = require('base64-img')
// var upload = multer({ dest: 'uploads/' })


const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'./uploads');
    },
    filename: function(req,file,cb){
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage,
    // limits:{
    //     fileSize:1024*1024*5
    // } 
});

const Schema = mongoose.Schema;

const server = express();
server.use(cors());
mongoose.connect('mongodb://localhost:27017/memory', { useNewUrlParser: true })
    .then(() => {
        console.log("connected to database");
    })
    .catch(() => {
        console.log("no connected");
    })

server.use(bodyParser.json());

const contentSchema=new Schema({
uid: String,
pageNo:Number,
image:String,
title: String,
name: String,
description:String,
imgData: String
})

const Content=mongoose.model('Content' ,contentSchema);

server.post('/profile', upload.single("file"), function (req, res, next) {
    // req.file is the `avatar` file
    console.log(req.file.filename);
    // req.body will hold the text fields, if there were any
    res.json(req.file.filename);
  })


server.post("/content",function(req,res){
    const content=new Content();
var base64;

    base64Img.base64( `./uploads/${req.body.imgData}` , function(err, data) {
        base64=data;
        // console.log(data)
    content.uid=req.body.uid;
    content.pageNo=req.body.pageNo;
    content.image=req.body.image;
    content.title=req.body.title;
    content.name=req.body.name;
    content.description=req.body.description;
    content.imgData=base64;

    console.log(req.body.uid);
        res.json(content);
    content.save();
    })
    
    
})

server.get("/getContent", function (req, res) {
    Content.find( {uid:req.query.uid},function(err,doc){
        
        res.json(doc);
    }).sort({pageNo:1})
})

server.delete('/deletePage/:id',(req,res)=>{
    Content.deleteOne({_id:req.params.id},function(err,doc){
        console.log(doc);
        res.json(doc);
    })
})

server.listen(8080, function () {
    console.log("server started");
})