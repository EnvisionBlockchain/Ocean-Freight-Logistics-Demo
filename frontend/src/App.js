import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Main from './components/Main';
import Layout from './workbench/components/Layout';
import Factory1 from './workbench/components/Factory';
import Home1 from './workbench/components/Home';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/UI-project" component={Factory1} />
            <Route exact path="/UI-project/:id" component={Home1} />
          </Switch>
        </Layout>

      </BrowserRouter>
    );
  }
}

export default App;
