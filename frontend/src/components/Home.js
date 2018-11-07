import React, { Component } from 'react';
import {Loader, Dimmer} from 'semantic-ui-react';
//import {Link} from 'react-router-dom';

class Home extends Component {
    state = {
    loadingData:false,
  }

  async componentDidMount(){
    this.setState({loadingData:true});
    document.title = "Azure UI";
    this.setState({loadingData:false});
  }

  render() {
    if(this.state.loadingData){
      return (
        <Dimmer active inverted>
        <Loader size='massive'>Loading...</Loader>
        </Dimmer>
      );
    }

    return (
      <div>
        <h1>Hi There!</h1>
      </div>
    );
  }
}

export default Home;