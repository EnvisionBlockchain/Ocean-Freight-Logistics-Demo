import React, { Component } from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import Main from './components/Main';
import Layout from './workbench/components/Layout';
import Factory1 from './workbench/components/Factory';
import Home1 from './workbench/components/Home';


// import Factory2 from './components/Factory';
// import Layout2 from './components/Home.js';
// import Home from './components/Home';
// import Layout from './components/Layout';
// import HelloWorld from './components/HelloWorld';


class App extends Component {
    render() {
    return (
      <div>
        <BrowserRouter>
        <Layout>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/UI-project" component={Factory1} />
            <Route exact path="/UI-project/:id" component={Home1} />
            {/*<Route exact path="/wb" component={Factory2} />*/}
            {/*<Route exact path="/wb/:chainAddress" component={Layout2} />*/}
          </Switch>
        </Layout>

      </BrowserRouter>
    );
  }
}


export default App;
