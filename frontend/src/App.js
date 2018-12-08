import React, { Component } from 'react';
import {BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Layout from './components/Layout';
import HelloWorld from './components/HelloWorld';
import 'adal-angular';
import AuthenticationContext from 'adal-angular';

//Set up adal
var config ={
    clientId: '134a2a3a-6224-4584-93f6-b1f38ce5fbdc',
};

class App extends Component {
  render() {
    //create authentication Context and check cached users
    var authContext = new AuthenticationContext(config);
    authContext.handleWindowCallback();

    //authContext.isCallback("tessdfgt");
    return (
      <div className="App">
          <h1>Azure login test</h1>
          <button onClick={() => { this.login(authContext) }}
                  className="btn btn-secondary btn-sm">Login</button>
          <button onClick={() => { this.logout(authContext) }}
                  className="btn btn-secondary btn-sm">Logout</button>
      </div>
    );
  }

    login(authContext){
      var user = authContext.getCachedUser();
      if (!user) {
        authContext.login();
        console.log("user is null")
      }
      else {
        console.log(user);
      }
    }
    logout(authContext) {
      authContext.logOut();
    }
}

export default App;
