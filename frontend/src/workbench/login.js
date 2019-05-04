import React, { Component } from 'react';
import {BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import 'adal-angular';
import AuthenticationContext from 'adal-angular';


//Set up adal

var config ={
  clientId: '134a2a3a-6224-4584-93f6-b1f38ce5fbdc',
};
class Workbench extends Component {
  render() {
    //create authentication Context and check cached users
    var authContext = new AuthenticationContext(config);
    authContext.handleWindowCallback();

    //user.isCallback("tessdfgt");
    return (
      <div className="App">
        <center>
          <h1>Azure login test</h1>
          <button onClick={() => { this.login(authContext) }}
                  className="btn btn-secondary btn-sm">Login</button>
          <button onClick={() => { this.logout(authContext) }}
                  className="btn btn-secondary btn-sm">Logout</button>
        </center>
      </div>
    );
  }

  login(authContext){
    var user = authContext.getCachedUser();
    if (!user) {
      authContext.login();
    }
    else {
      console.log(user);
    }
  }

  logout(authContext) {
    authContext.logOut();
  }
}

export default Workbench;
