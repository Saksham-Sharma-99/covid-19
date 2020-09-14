const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const alert = require("alert");
const csvToJson = require("csvtojson");
const api = require(__dirname + "/API.js");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));


var serverJSON = [];



//GET
var notif;
app.get("/", function(req, res) {
  console.log(serverJSON);
  api.getContacts(function(reg, pr) {
    api.getNotifications(function(n) {
      console.log(n);
      notif = n;
      res.render("home", {
        tnumber: "1075",
        cnumber: pr[0].number,
        email: pr[1].email,
        notifArray: n,
        sN : "India",
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
        d6d:filteredData[5].dd,
      });
    });
  })
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




//PORT Setup
app.listen(3000, function() {
  console.log("Started listening Sucessfully");

  if (serverJSON.length === 0) {
    csvToJson().fromFile(__dirname + '/covid19india.csv')
      .then(json => {
        serverJSON = json;
        // users is a JSON array
        // log the JSON array
        console.log(json);
      }).catch(err => {
        // log error if any
        console.log(err);
      });
  }
});


//Managing database get req
var fliteredData = [];

function findData(State, Gender, AgeMin, AgeMax, DateMin, DateMax) {
  var features = [];

  if (state === "") {
    features.push("Delhi");
  } else {
    features.push(State);
  }
  //
  // if (gender === "Male" || gender === "Female") {
  //   features.push(Gender);
  // } else {
  //   features.push("");
  // }
  //
  // if (AgeMin != "") {
  //   features.push(AgeMin);
  //   features.push(AgeMax);
  // } else {
  //   features.push("");
  //   features.push("");
  // }
  //
  // if (DateMin != "") {
  //   features.push(DateMin);
  // } else {
  //   features.push("30/01/2020");
  // }
  //
  // if (DateMax != "") {
  //   features.push(DateMax);
  // } else {
  //   features.push("26/4/2020");
  // }

  for (var i = 0; i < serverJSON.length; i++) {
    if (serverJSON[i].state === features[0]) {
      filteredData.push(serverJSON[i]);
  }
}
}

let state = [ "Andhra Pradesh",
                "Arunachal Pradesh",
                "Assam",
                "Bihar",
                "Chhattisgarh",
                "Goa",
                "Gujarat",
                "Haryana",
                "Himachal Pradesh",
                "Jammu and Kashmir",
                "Jharkhand",
                "Karnataka",
                "Kerala",
                "Madhya Pradesh",
                "Maharashtra",
                "Manipur",
                "Meghalaya",
                "Mizoram",
                "Nagaland",
                "Odisha",
                "Punjab",
                "Rajasthan",
                "Sikkim",
                "Tamil Nadu",
                "Telangana",
                "Tripura",
                "Uttarakhand",
                "Uttar Pradesh",
                "West Bengal",
                "Andaman and Nicobar Islands",
                "Chandigarh",
                "Dadra and Nagar Haveli",
                "Daman and Diu",
                "Delhi",
                "Lakshadweep",
                "Puducherry"]
