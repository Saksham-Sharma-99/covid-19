const https = require("https");
const lodash = require("lodash");

module.exports.getContacts = getContacts;
module.exports.getNotifications = getNotifications;
module.exports.getDashboardData = getDashboardData;
module.exports.getCollegeDetails = getCollegeDetails;

const baseUrl = "https://api.rootnet.in/covid19-in/";


function makeRequest(endPoint, callback) {
  https.get(baseUrl + endPoint, "JSON", function(response) {
    var data;
    response.on("data", function(chunk) {
      if (!data) {
        data = chunk;
      } else {
        data += chunk;
      }
    });
    response.on("end", function() {
      const d = JSON.parse(data);
      callback(d);
    });
  });
}



// contacts data
var contactsRegional = [];
var contactsPrimary = [];
function contactDetails(loc, number) {
  this.loc = loc;
  this.number = number;
}
function getContacts(callBack) {
  makeRequest("contacts", function(d) {
      contactsRegional = [];
      for (var i = 0; i < d.data.contacts.regional.length; i++) {
        var item = new contactDetails(d.data.contacts.regional[i].loc, d.data.contacts.regional[i].number);
        contactsRegional.push(item);
      }
      contactsPrimary.push({
        "number": d.data.contacts.primary.number
      });
      contactsPrimary.push({
        "email": d.data.contacts.primary.email
      });
      contactsPrimary.push({
        "twitter": d.data.contacts.primary.twitter
      });
      contactsPrimary.push({
        "facebook": d.data.contacts.primary.facebook
      });
    callBack(contactsRegional,contactsPrimary);
  })
}



//notifications data
var notifications = [];
function notificationDetails(title, link) {
  this.title = title;
  this.link = link;
}
function getNotifications(callBack) {
  makeRequest("notifications", function(d) {
    notifications = [];
    for (var i = 1; i < d.data.notifications.length; i++) {
      var item = new notificationDetails(d.data.notifications[i].title, d.data.notifications[i].link);
      notifications.push(item);
    }
    callBack(notifications);
  })
}



//hospitals dashboard data
var regionalHospitals = [];
function dashboardDetails(state,ruralHospitals,ruralBeds,urbanHospitals,urbanBeds,totalBeds,totalHospitals){
  this.state = state;
  this.ruralHospitals = ruralHospitals;
  this.ruralBeds = ruralBeds;
  this.urbanHospitals = urbanHospitals;
  this.urbanBeds = urbanBeds;
  this.totalBeds = totalBeds;
  this.totalHospitals = totalHospitals;
}
function getDashboardData(stateName , callback){
  makeRequest("hospitals/beds",function(d){
    regionalHospitals = [];
    for (var i = 1; i < d.data.regional.length; i++) {
      var item = new dashboardDetails(d.data.regional[i].state,d.data.regional[i].ruralHospitals,
         d.data.regional[i].ruralBeds,d.data.regional[i].urbanHospitals,d.data.regional[i].urbanBeds,
        d.data.regional[i].totalBeds,d.data.regional[i].totalHospitals);
      regionalHospitals.push(item);
    }
    for(var i = 0 ; i< regionalHospitals.length ; i++){
      if (lodash.kebabCase(stateName) ===lodash.kebabCase(regionalHospitals[i].state)){
        callback(regionalHospitals[i]);
        return;
      }
    }
    callback("nada");
  })
}


//medical college details
var colleges = [];
function medicalCollegeDetails(state,name,city,ownership,admissionCapacity,hospitalBeds){
  this.state = state;
  this.name = name;
  this.city = city;
  this.ownership = ownership;
  this.admissionCapacity = admissionCapacity;
  this.hospitalBeds = hospitalBeds
}
function getCollegeDetails(param,callback){
  makeRequest("hospitals/medical-colleges",function(d){
    colleges = []
    for(var i = 0 ; i<d.data.medicalColleges.length ; i++){
      if(lodash.kebabCase(d.data.medicalColleges[i].state) === param || lodash.kebabCase(d.data.medicalColleges[i].name) === param ||
        lodash.kebabCase(d.data.medicalColleges[i].city) === param || lodash.kebabCase(d.data.medicalColleges[i].ownership) === param ||
         lodash.kebabCase(d.data.medicalColleges[i].admissionCapacity) === param || lodash.kebabCase(d.data.medicalColleges[i].hospitalBeds) === param){
           var item = new medicalCollegeDetails(d.data.medicalColleges[i].state,d.data.medicalColleges[i].name,
           d.data.medicalColleges[i].city,d.data.medicalColleges[i].ownership,d.data.medicalColleges[i].admissionCapacity,
         d.data.medicalColleges[i].hospitalBeds)
           colleges.push(item);
         }
    }
    callback(colleges);
  });
}
