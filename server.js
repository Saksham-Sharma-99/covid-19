const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const api = require(__dirname + "/API.js")

const app = express();
app.use(express.static("public"));
app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
  res.render("home");
  var contacts = api.helpLineNumbers();
  console.log(contacts);
});


app.listen(3000 , function(){
  console.log("Started listening Sucessfully");
})
