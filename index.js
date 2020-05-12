const express = require("express");
const bodyParser = require("body-parser");
var mongoose = require('mongoose');
const cors = require("cors")
const pdf = require('html-pdf');
const pdfTemplate = require('./documents')
var multer  = require('multer')
const path = require('path');
// var upload = multer({ dest: 'uploads/' })


const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'./uploads');
    },
    filename: function(req,file,cb){
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage });

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
pageNo:Number,
image:String,
title: String,
description:String
})

const Content=mongoose.model('Content' ,contentSchema);

server.post('/profile', upload.single("file"), function (req, res, next) {
    // req.file is the `avatar` file
    console.log(req.file.filename);
    // req.body will hold the text fields, if there were any
    res.json(req.file.filename);
  })

// server.post('/createpdf', (req,res)=>{
//     // req.body will hold the text fields, if there were any
//     console.log(req.body);
// pdf.create(pdfTemplate(req.body), {}).toFile('memory.pdf', (err)=>{
//     if(err){
//         console.log("error");
//         res.send( Promise.reject());
//     }
//     else{
//     res.send( Promise.resolve());
//     }
// });

// });

// server.get('/fetchpdf', (req,res)=>{
// res.sendFile(`${__dirname}/memory.pdf`)
// })


server.post("/content",function(req,res){
    const content=new Content();
    content.pageNo=req.body.pageNo;
    content.image=req.body.image;
    content.title=req.body.title;
    content.description=req.body.description;

    res.json(content);
    console.log("hello");
    console.log(content);
    content.save();
})

server.get("/getContent", function (req, res) {
    Content.find({},function(err,doc){
        console.log(doc);
        res.json(doc);
    })
})


server.get("/json/:name/:surname", function (req, res) {
    res.send(req.params);
    console.log(req.params);
})
server.get("/body", function (req, res) {

    let data = './uploads/10.jpg';
    let buff = new Buffer(data);
    let base64data = buff.toString('base64');
    res.send(base64data);
    console.log('"' + data + '" converted to Base64 is "' + base64data + '"');
})

server.listen(8080, function () {
    console.log("server started");
})