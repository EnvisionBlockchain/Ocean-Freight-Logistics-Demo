import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './workbench/components/Home';
import Factory from './workbench/components/Factory';
import Layout from './workbench/components/Layout';


class App extends Component {
    render() {
    return (
      <BrowserRouter>
      <Layout>
        <Switch>
          <Route exact path="/UI-project" component={Factory} />
          <Route exact path="/UI-project/:chainAddress" component={Home} />
        </Switch>
      </Layout>
    </BrowserRouter>
    );
  }
}


export default App;
