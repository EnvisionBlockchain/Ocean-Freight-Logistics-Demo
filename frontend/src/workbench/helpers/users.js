/*
  This file allows login, redirection and logout using the authcontext module.
  User is authenticated at creation

  Author: Steven Flynn
 */
import AuthenticationContext from "adal-angular";


class AdUser{
  authContext=null;
  token="";
  config={
    clientId: '134a2a3a-6224-4584-93f6-b1f38ce5fbdc',
    postLogoutRedirectUri: 'http://localhost:3000'
  };

  constructor(){
    this.authContext=new AuthenticationContext(this.config);
    this.authContext.handleWindowCallback();
    this.authenticateUser();
  }

  authenticateUser(){
    //check if user is authenticated
    let user = this.authContext.getCachedUser();
    if(!user){
      this.authContext.login();
    }
    else{
      this.token =this.retrieveToken();
    }
  }

  retrieveToken() {
    let token='';
    this.token= this.authContext.acquireToken(this.config.clientId, function (err, accessToken) {
        if (!err) {
          token = accessToken;
        }
        else {
          token= "ERROR";
        }
      }
    );
    return token;
  }

  getToken(){
    return this.token;
  }

  logout(){
    this.authContext.logOut();
  }

}

export default AdUser;