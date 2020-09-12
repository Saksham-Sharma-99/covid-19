const https = require("https");

const baseUrl = "https://api.rootnet.in/covid19-in/"

module.exports.helpLineNumbers = helpLineNumbers;



var contactsRegional = []
function contactsR(loc,number){
  this.loc = loc;
  this.number = number;
}

function helpLineNumbers(){
  return makeReq("contacts")
}




function makeReq(endPoint){
  https.get(baseUrl+endPoint,"JSON", function(response){
    var data;

    response.on("data", function(chunk) {
      if (!data) {
        data = chunk;
      } else {
        data += chunk;
      }
    });

    response.on("end", function() {
        const d=JSON.parse(data);
        console.log(d.data.contacts);
        
    });
  })
}
