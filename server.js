const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const api = require(__dirname +"/API.js")

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.render("home");
  api.getNotifications(function(n){
    console.log(n);
  })
});


app.listen(3000, function() {
  console.log("Started listening Sucessfully");
})
