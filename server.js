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

var stateData;
var stateCollegeData;
app.get("/dashboard",function(req,res){
  // let data = JSON.parse(stateData.dashboardData)
  var stateName = stateData.state;
  var ruralHospitals = stateData.ruralHospitals;
  var urbanHospitals = stateData.urbanHospitals;
  var ruralBeds = stateData.ruralBeds;
  var urbanBeds = stateData.urbanBeds;
  var totalHospitals = stateData.totalHospitals;
  var totalBeds = stateData.totalBeds;
  res.render("dashboard",{stateName : stateName,collegArr:stateCollegeData,
                          hospitals: "Hospitals" , uH: urbanHospitals , rH : ruralHospitals,
                          hospitalBeds:"Hospital Beds",uB:urbanBeds , rB:ruralBeds});
});



//POST
app.post("/dashboard",function(req,res){
  console.log(req.body);
api.getCollegeDetails(lodash.kebabCase(req.body.stateName),function(collegeData){
  stateCollegeData = collegeData;
  console.log(stateCollegeData);
  api.getDashboardData(req.body.stateName,function(dashboardData){
    if(dashboardData === "nada"){
      alert("No such state exists in India");
      res.redirect("/");
    }else{
    stateData = dashboardData;
    console.log(stateData);
    res.redirect("/dashboard");
  }
  })
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
