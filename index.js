const express = require("express");
const bodyParser = require("body-parser");
var mongoose = require('mongoose');
const cors=require("cors")
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
image:String,
title: String,
description:String
})

const Content=mongoose.model('Content' ,contentSchema);

server.post("/content",function(req,res){
    const content=new Content();

    content.image=req.body.image;
    content.title=req.body.title;
    content.description=req.body.description;

    res.json(content);
    console.log("hello");
    console.log(content);
    content.save();
})

server.get("/demo/:name", function (req, res) {
    Content.findOne({name:req.params.name},function(err,doc){
        console.log(doc);
        res.json(doc);
    })
})


server.get("/json/:name/:surname", function (req, res) {
    res.send(req.params);
    console.log(req.params);
})
server.post("/body", function (req, res) {
    res.send(req.body);
    console.log(req.body);
})

server.listen(8080, function () {
    console.log("server started");
})