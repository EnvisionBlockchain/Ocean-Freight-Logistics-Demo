import React, { Component } from 'react';
import '../App.css';
//import './helpers/blockchain';
import 'adal-angular';
import AuthenticationContext from 'adal-angular';


//Set up adal
var config ={
    clientId: '134a2a3a-6224-4584-93f6-b1f38ce5fbdc',
};



class Login extends Component {
    render() {
        //create authentication Context
        var authContext = new AuthenticationContext(config);
        authContext.handleWindowCallback();

        //get api key
        authContext.acquireToken(config.clientId, function(error, token){
            console.log(error,token);
        });
        var user=authContext.getCachedUser();
        return (
            <div className="App">
            <h1>Azure login test </h1>
        <button onClick={() => { this.login(authContext) }}
        className="btn btn-secondary btn-sm">Login</button>
            <button onClick={() => { this.logout(authContext) }}
        className="btn btn-secondary btn-sm">Logout</button>

            <h3>{user ? user.userName : ""}</h3>
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

export default Login;
