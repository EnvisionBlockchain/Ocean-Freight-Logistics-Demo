import React, { Component } from 'react';
import {BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Layout from './components/Layout';
import HelloWorld from './components/HelloWorld';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route exact path="/UI-project" component={Home} />
            <Route exact path="/UI-project/frontend/helloworld" component={HelloWorld} />
          </Switch>
        </Layout>
      </BrowserRouter>
    );
  }
}

export default App;