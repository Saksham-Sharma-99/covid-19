const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const alert = require("alert");
const csvToJson = require("csvtojson");
const mongoose = require("mongoose");
const api = require(__dirname + "/API.js");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
mongoose.connect("mongodb+srv://admin-saksham:Saksham99@iit@covid-19-database.oqja8.mongodb.net/covidStats",{ useNewUrlParser: true, useUnifiedTopology: true });
const StateData = mongoose.model("StateData" ,{
  reportdOn: String,
  age: String,
  gender: String,
  state:String,
  status:String
});


//GET
var notif;
var stateName = "Rajasthan";
app.get("/", function(req, res) {
  findData(stateName ,function(filteredData){
    api.getContacts(function(reg, pr) {
      api.getNotifications(function(n) {
        console.log(n);
        notif = n;
        res.render("home", {
          tnumber: "1075",
          cnumber: pr[0].number,
          email: pr[1].email,
          notifArray: n,
          sN : stateName,
          dHt:Number(filteredData[0].dh)+Number(filteredData[1].dh)+Number(filteredData[2].dh)+Number(filteredData[3].dh)+Number(filteredData[4].dh)+Number(filteredData[5].dh),
          dRt:Number(filteredData[0].dr)+Number(filteredData[1].dr)+Number(filteredData[2].dr)+Number(filteredData[3].dr)+Number(filteredData[4].dr)+Number(filteredData[5].dr),
          dDt:Number(filteredData[0].dd)+Number(filteredData[1].dd)+Number(filteredData[2].dd)+Number(filteredData[3].dd)+Number(filteredData[4].dd)+Number(filteredData[5].dd),
          d1h:filteredData[0].dh,
          d1r:filteredData[0].dr,
          d1d:filteredData[0].dd,

          d2h:filteredData[1].dh,
          d2r:filteredData[1].dr,
          d2d:filteredData[1].dd,

          d3h:filteredData[2].dh,
          d3r:filteredData[2].dr,
          d3d:filteredData[2].dd,

          d4h:filteredData[3].dh,
          d4r:filteredData[3].dr,
          d4d:filteredData[3].dd,

          d5h:filteredData[4].dh,
          d5r:filteredData[4].dr,
          d5d:filteredData[4].dd,

          d6h:filteredData[5].dh,
          d6r:filteredData[5].dr,
          d6d:filteredData[5].dd
        });
      });
    })
  });


});

app.get("/notifs", function(req, res) {
  res.render("notifications", {
    notifArray: notif
  });
})

var stateData;
var stateCollegeData;
app.get("/dashboard", function(req, res) {
  // let data = JSON.parse(stateData.dashboardData)
  var stateName = stateData.state;
  var ruralHospitals = stateData.ruralHospitals;
  var urbanHospitals = stateData.urbanHospitals;
  var ruralBeds = stateData.ruralBeds;
  var urbanBeds = stateData.urbanBeds;
  var totalHospitals = stateData.totalHospitals;
  var totalBeds = stateData.totalBeds;
  res.render("dashboard", {
    stateName: stateName,
    collegArr: stateCollegeData,
    hospitals: "Hospitals",
    uH: urbanHospitals,
    rH: ruralHospitals,
    hospitalBeds: "Hospital Beds",
    uB: urbanBeds,
    rB: ruralBeds
  });
});



//POST
app.post("/dashboard", function(req, res) {
  console.log(req.body);
  api.getCollegeDetails(lodash.kebabCase(req.body.stateName), function(collegeData) {
    stateCollegeData = collegeData;
    console.log(stateCollegeData);
    api.getDashboardData(req.body.stateName, function(dashboardData) {
      if (dashboardData === "nada") {
        alert("No such state exists in India");
        res.redirect("/");
      } else {
        stateData = dashboardData;
        console.log(stateData);
        res.redirect("/dashboard");
      }
    })
  })
});

app.post("/", function(req, res) {
  api.getContacts(function(regional, primary) {
    var stateName = ""
    var contact = "No Such State Exists in India";
    for (var i = 0; i < regional.length; i++) {
      if (lodash.kebabCase(req.body.stateName) === lodash.kebabCase(regional[i].loc)) {
        contact = regional[i].number;
        stateName = regional[i].loc;
      }
    }
    if (stateName != "") {
      alert("Emergency Contact for " + stateName + " is : " + contact)
      res.redirect("/");
    } else {
      alert(contact)
      res.redirect("/");
    }
  });
});

app.post("/stateData" , function(req,res){
  console.log(req.body);
  stateName = req.body.stateName;
  res.redirect("/");
})



//PORT Setup
app.listen(3000, function() {
  console.log("Started listening Sucessfully");
});


//Managing database get req
function filter(dh,dr,dd){
  this.dh = dh;
  this.dr = dr;
  this.dd = dd;
}
function findData(stateName , callback){
  StateData.find({state:stateName},function(err,docs){
    var filteredData = [];
    var tempData = [];

    for(var i = 0 ; i<docs.length ; i++){

      tempData.push({
        state : docs[i].state,
        status : docs[i].status,
        date : docs[i].reportdOn
      });
    }

    console.log(tempData);
    var d1d=0,d1r=0,d1h=0;
    var d2d=0,d2r=0,d2h=0;
    var d3d=0,d3r=0,d3h=0;
    var d4d=0,d4r=0,d4h=0;
    var d5d=0,d5r=0,d5h=0;
    var d6d=0,d6r=0,d6h=0;

    for(var i = 0 ; i<tempData.length ; i++){
      if(tempData[i].date.slice(4,5) === "4" ){
        if(tempData[i].date.slice(0,1) === "0"){
          if(Number(tempData[i].date.slice(1,2)) > 7){
            if(tempData[i].status === "Deceased"){
              d6d+=1;
            }else if(tempData[i].status === "Hospitalized"){
              d6h+=1;
            }else{
              d6r+=1;
            }
          }else{
            if(tempData[i].status === "Deceased"){
              d5d+=1;
            }else if(tempData[i].status === "Hospitalized"){
              d5h+=1;
            }else{
              d5r+=1;
            }
          }
        }else{
          if(Number(tempData[i].date.slice(0,2)) < 25){
            if(tempData[i].status === "Deceased"){
              d6d+=1;
            }else if(tempData[i].status === "Hospitalized"){
              d6h+=1;
            }else{
              d6r+=1;
            }
          }
        }
      }

      if(tempData[i].date.slice(4,5) === "3" ){
        if(tempData[i].date.slice(0,1) === "0"){
          if(Number(tempData[i].date.slice(1,2)) > 4){
            if(tempData[i].status === "Deceased"){
              d4d+=1;
            }else if(tempData[i].status === "Hospitalized"){
              d4h+=1;
            }else{
              d4r+=1;
            }
          }else{
            if(tempData[i].status === "Deceased"){
              d3d+=1;
            }else if(tempData[i].status === "Hospitalized"){
              d3h+=1;
            }else{
              d3r+=1;
            }
          }
        }else{
          if(Number(tempData[i].date.slice(0,2)) < 25){
            if(tempData[i].status === "Deceased"){
              d4d+=1;
            }else if(tempData[i].status === "Hospitalized"){
              d4h+=1;
            }else{
              d4r+=1;
            }
          }else{
            if(tempData[i].status === "Deceased"){
              d5d+=1;
            }else if(tempData[i].status === "Hospitalized"){
              d5h+=1;
            }else{
              d5r+=1;
            }
          }
        }
      }

      if(tempData[i].date.slice(4,5) === "2" ){
            if(tempData[i].status === "Deceased"){
              d3d+=1;
            }else if(tempData[i].status === "Hospitalized"){
              d3h+=1;
            }else{
              d3r+=1;
            }
      }
      if(tempData[i].date.slice(4,5) === "1" ){
            if(tempData[i].status === "Deceased"){
              d2d+=1;
            }else if(tempData[i].status === "Hospitalized"){
              d2h+=1;
            }else{
              d2r+=1;
            }
      }

    }
    var itm1 = new filter(d1h,d1r,d1d);
    var itm2 = new filter(d2h,d2r,d2d);
    var itm3 = new filter(d3h,d3r,d3d);
    var itm4 = new filter(d4h,d4r,d4d);
    var itm5 = new filter(d5h,d5r,d5d);
    var itm6 = new filter(d6h,d6r,d6d);
    filteredData.push(itm1);filteredData.push(itm2);filteredData.push(itm3);filteredData.push(itm4);filteredData.push(itm5);filteredData.push(itm6);
    console.log(filteredData);
    callback(filteredData);
  })
}
