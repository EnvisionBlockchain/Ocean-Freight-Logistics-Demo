import React, { Component } from 'react';
import {BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Layout from './components/Layout';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route exact path="/" component={Home} />
            {/*<Route exact path="/Zatanna/songs" component={} />*/}
          </Switch>
        </Layout>
      </BrowserRouter>
    );
  }
}

export default App;