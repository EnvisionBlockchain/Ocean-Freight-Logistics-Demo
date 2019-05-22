// import React, { Component } from 'react';
// import AuthenticationContext from 'adal-angular';
// import { Redirect } from 'react-router-dom';
// import api from './helpers/Api.js';
// import Header from './components/Header.js';
//
//
// //Set up adal
// var config ={
//     clientId: '134a2a3a-6224-4584-93f6-b1f38ce5fbdc',
// };
//
// var context={
//   token : "#$G",
//   user : {'test':"test"}
// };
//
// class Dashboard extends Component {
//   render(){
//     var that=this;
//
//     //create authentication Context and check cached users
//     var authContext = new AuthenticationContext(config);
//     authContext.handleWindowCallback();
//
//     //check if user is authenticated
//     var user = authContext.getCachedUser();
//     if(!user){
//       authContext.login();
//     }
//     else{
//       authContext.acquireToken(config.clientId, function(err, accessToken){
//         if(!err){
//           //this.setToken(accessToken);
//           //that.context.token=accessToken;
//           //that.context['token']=accessToken;
//           context.token=accessToken;
//         }
//         else{
//           context.token=err;
//         }
//       });
//     }
//
//     //pull data from Api
//     api.run('GET', '/api/v2/users/me', context.token, function(err, data){
//       if(!err){
//         context.user=JSON.parse(data);
//         console.log(context.user.currentUser);
//       }
//       else{
//         context.user=err;
//       }
//     });
//
//     console.log(context.user);
//     return(
//       <div>
//         <Header />
//         <center>
//           <h1>Welcome to the dashboard</h1>
//           <h4>{context.user.test}</h4>
//         </center>
//       </div>
//     );
//   }
//
//   setToken(newToken){
//     this.context.token=newToken
//   }
// }
//
// export default Dashboard;
