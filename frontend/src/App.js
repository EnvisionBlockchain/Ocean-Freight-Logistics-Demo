import React, { Component } from 'react';
<<<<<<< HEAD
// import Home from './components/Home';
// import Layout from './components/Layout';
// import HelloWorld from './components/HelloWorld';

=======
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Factory from './components/Factory';
import Layout from './components/Layout';
>>>>>>> ade384b8a8ed983aee31db71c4e663f6c17dce65

class App extends Component {
    render() {
    return (
<<<<<<< HEAD
      <div className="App">
        <center>
          <h1>Choose which version of our app to use</h1>
          <a href="/dashboard"> Workbench </a>
          <p><h3>Eth Baas</h3></p>
        </center>
      </div>
=======
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route exact path="/UI-project" component={Factory} />
            <Route exact path="/UI-project/:chainAddress" component={Home} />
          </Switch>
        </Layout>
      </BrowserRouter>
>>>>>>> ade384b8a8ed983aee31db71c4e663f6c17dce65
    );
  }
}


export default App;
