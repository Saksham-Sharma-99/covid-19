const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const alert = require("alert");
const api = require(__dirname +"/API.js")

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

//GET
app.get("/", function(req, res) {
  api.getContacts(function(reg,pr){
    api.getNotifications(function(n){
      console.log(n);
      res.render("home" , {
        tnumber : "1075",
        cnumber : pr[0].number,
        email : pr[1].email
      });
    });
  })


});
app.get("/notifs",function(req,res){
  res.render("notifications");
})
app.get("/dashboard/:name",function(req,res){
  res.render("dashboard");
});







//POST
app.post("/dashboard",function(req,res){
  console.log(req.body);
  api.getDashboardData(req.body.stateName,function(dashboardData){
    console.log(dashboardData);
    res.redirect("/dashboard/"+lodash.kebabCase(req.body.stateName))
  })
});

app.post("/",function(req,res){
  api.getContacts(function(regional,primary){
    var stateName = ""
    var contact = "No Such State Exists in India";
    for(var i = 0 ; i<regional.length ; i++){
      if(lodash.kebabCase(req.body.stateName) === lodash.kebabCase(regional[i].loc)){
        contact = regional[i].number;
        stateName = regional[i].loc;
      }
    }
    if (stateName!= ""){
    alert("Emergency Contact for "+stateName+ " is : " + contact)
    res.redirect("/");
  }else{
    alert(contact)
    res.redirect("/");
  }
});
});




//PORT Setup
app.listen(3000, function() {
  console.log("Started listening Sucessfully");
});
