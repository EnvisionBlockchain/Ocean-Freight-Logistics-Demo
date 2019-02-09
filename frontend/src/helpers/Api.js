const https = require('https');


var api={};

//api._path='/oauth2/token';
api._path='';

api.run=function(method, path, token, callback){
    const requestBody = {
      resource: '134a2a3a-6224-4584-93f6-b1f38ce5fbdc',
      client_id: '134a2a3a-6224-4584-93f6-b1f38ce5fbdc',
      client_secret: 'z7IF0Zvcma1vWUZLo+1E7AOqljAxE0n9E21djNWl/Mg=',
      grant_type: 'client_credentials'
    };

    const options = {
      hostname: 'login.microsoftonline.com/envisionblockchain.com/oauth2/token',
      method: 'GET',
      path: this._path,
      headers:{
        accept:'application/json',
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
            console.log(data);
        });

        http_res.on("error", function (err) {
            // append this chunk to our growing `data` var
            console.log(err);
            //callback(true, null);
        });
    });
};


api.run('GET','/api/v1/users','al;sdkjhg', function(err, data){
  console.log("test");
});
module.exports=api;
