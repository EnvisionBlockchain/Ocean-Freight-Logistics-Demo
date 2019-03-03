import React, { Component } from 'react';
import AuthenticationContext from 'adal-angular';
import { Redirect } from 'react-router-dom';
import api from '../../helpers/Api.js';
import Header from '../Header.js';


//Set up adal
var config ={
    clientId: '134a2a3a-6224-4584-93f6-b1f38ce5fbdc',
};

var context={
  token : "#$G",
  data : "NOT CHANGED"
}

class Dashboard extends Component {
  render(){
    var that=this;

    //create authentication Context and check cached users
    var authContext = new AuthenticationContext(config);
    authContext.handleWindowCallback();

    //check if user is authenticated
    var user = authContext.getCachedUser();
    if(!user){
      authContext.login();
    }
    else{
      authContext.acquireToken(config.clientId, function(err, accessToken){
        if(!err){
          //this.setToken(accessToken);
          that.context.token=accessToken;
        }
        else{
          that.context.token=err;
        }
      });
    }

    //pull data from Api
    api.run('GET', '/api/v2/users/me', that.context.token, function(err, data){
      if(!err){
        that.context.data=data;
      }
      else{
        console.log("err in dashboard= " + err);
        that.context.data=err;
      }
    });

    return(
      <div>
        <Header />
        <center>
          <h1>Welcome to the dasboard</h1>
          <h4>{that.context.data}</h4>
        </center>
      </div>
    );
  }

  setToken(newToken){
    console.log("assign token");
    this.context.token=newToken
  }
}

export default Dashboard;
