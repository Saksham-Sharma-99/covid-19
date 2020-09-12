const https = require("https");

const baseUrl = "https://api.rootnet.in/covid19-in/"

module.exports.helpLineNumbers = helpLineNumbers;



function helpLineNumbers(){
  return makeReq("contacts")
}


function makeReq(endPoint){
  https.get(baseUrl+endPoint,function(response){
    response.on("data",function(data){
      const d = JSON.parse(data);
      console.log(d);
      return d;
    })
  })
}
