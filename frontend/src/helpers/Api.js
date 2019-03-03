const https = require('https');


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
            console.log("Error= False", typeof(data), http_res.headers);
            callback(false, data);
        });

        http_res.on("error", function (err) {
            console.log("err= " + err);
            callback(true, null);
        });
    });
};

api.run('GET', '/api/v2/users/me', "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1zeE1KTUxDSURXTVRQdlp5SjZ0eC1DRHh3MCIsImtpZCI6Ii1zeE1KTUxDSURXTVRQdlp5SjZ0eC1DRHh3MCJ9.eyJhdWQiOiIxMzRhMmEzYS02MjI0LTQ1ODQtOTNmNi1iMWYzOGNlNWZiZGMiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82MTA4ODg1Zi0xNzg3LTQzZmUtYjBiMi1lY2Q2YzA5Y2Y5NTUvIiwiaWF0IjoxNTUxNDAzMzIzLCJuYmYiOjE1NTE0MDMzMjMsImV4cCI6MTU1MTQwNzIyMywiYWlvIjoiQVNRQTIvOEtBQUFBT0FLUjFtR3p4ZXdQdHFPQjlHUzFoN3RqellLdVNoWXJKbG5HNUI1V3dJZz0iLCJhbXIiOlsicHdkIl0sImZhbWlseV9uYW1lIjoiRmx5bm4iLCJnaXZlbl9uYW1lIjoiU3RldmUiLCJpcGFkZHIiOiI2Ny44Ny4yMTEuMjM2IiwibmFtZSI6IlN0ZXZlIEZseW5uIiwibm9uY2UiOiI3NWVkMzEyNS1jNDFmLTQzYjMtOGQ3MC01ZmI3NmQzYTJmYjMiLCJvaWQiOiJiMDg4YmY5Yi1kYWJlLTRmZGUtYjRmMS03ZmQ4OGY5YjUwMGIiLCJyb2xlcyI6WyJBZG1pbmlzdHJhdG9yIl0sInN1YiI6IkRxVlVBU3o5aEJMb1MtRDdaR3VEZ2ZzbXlUTUo0N245ODJZbkVzVGl5VVUiLCJ0aWQiOiI2MTA4ODg1Zi0xNzg3LTQzZmUtYjBiMi1lY2Q2YzA5Y2Y5NTUiLCJ1bmlxdWVfbmFtZSI6InN0ZXZlLmZseW5uQGVudmlzaW9uYmxvY2tjaGFpbi5jb20iLCJ1cG4iOiJzdGV2ZS5mbHlubkBlbnZpc2lvbmJsb2NrY2hhaW4uY29tIiwidXRpIjoiOXNCazJTbE45VXlkRXdMVlZkNEJBQSIsInZlciI6IjEuMCJ9.Z2lX7mHEnGgXKwGMB17sOTd7fdmgcq1o_H7okJ7m63KGTPxBpa-BO4gyAWoagCiozGr31cyNEwsukfYjFQREphm0j8Ik56cHEmi6XjoslknvPL3EQwUc5hdv_yliaXVohxAzeNaazym18bUbRPWf8bk_9cQM2f7UkLUPQwuLpz0SsWf-nZSn5qoYPet3QeZV-w6WluzQxAXxgXEugB58hkYu5m_tXK4CKntS1BbgWwjXX3Wy3MH1LBi85SBKGhz7_NUBDVGAOM9U6tV1DZaie93ivMGWHg0NoCbIOyuoMc2A7PRWh7yO0Fnrp7s8uXeDDkCUYXv1ZJMUFZe00KcA_g", function(err, data){
  if(err){
    console.log(err);
  }
  else{
    console.log(data);
  }
});

module.exports=api;
