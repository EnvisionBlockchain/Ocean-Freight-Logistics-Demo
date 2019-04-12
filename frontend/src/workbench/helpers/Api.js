const https = require('https');

//TODO:axios- api library, used for api's. Fetch library (more bugs)
var api={};

//api._path='/oauth2/token';

api.run=function(method, path, token, callback){
    const options = {
      hostname: 'ethpoasanboxwb-ohtlvu-api.azurewebsites.net',
      method: method,
      path: path,
      headers:{
        Authorization: 'Bearer ' + token
      }
    };

    https.get(options, function(http_res){
      var data = "";

      // this event fires many times, each time collecting another piece of the response
       http_res.on("data", function (chunk) {
           // append this chunk to our growing `data` var
           data += chunk;
       });

       // this event fires *one* time, after all the `data` events/chunks have been gathered
       http_res.on("end", function () {
            // you can use res.send instead of console.log to output via express
            callback(false, data);
        });

        http_res.on("error", function (err) {
            callback(true, err);
        });
    });
};

module.exports=api;
