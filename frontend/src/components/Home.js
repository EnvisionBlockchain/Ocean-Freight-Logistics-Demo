import React, { Component } from 'react';
import {Loader, Dimmer, Button, Modal} from 'semantic-ui-react';
//import {Link} from 'react-router-dom';
import web3 from '../ethereum/web3';
import {SupplyChainInstance} from '../ethereum/contractInstance';
import ExportClearance from './ExportClearance';

class Home extends Component {
    state = {
    loadingData:false,
    account:'',
    contractState:'',
    instanceShipper:'',
  }

  async componentDidMount(){
    this.setState({loadingData:true});
    document.title = "Azure UI";

    const accounts = await web3.eth.getAccounts();
    let contractState = await SupplyChainInstance.methods.State().call({from:accounts[0]});
    if (contractState === '0'){
      contractState = 'Begin Trade';
    }

    let instanceShipper = await SupplyChainInstance.methods.InstanceShipper().call({from:accounts[0]});

    this.setState({loadingData:false, account:accounts[0], contractState, instanceShipper});
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
        <h1>Supplychain Transportation</h1>
        <b>Contract State:</b> {this.state.contractState}
        <br/>
        {this.state.instanceShipper===this.state.account && 
           <Modal trigger={<Button primary>Export Clearance</Button>}>
		    <Modal.Header>Initiate Export Clearance</Modal.Header>
		    <Modal.Content>
		      <ExportClearance account={this.state.account} />
		    </Modal.Content>
		  </Modal>
        }

      </div>
    );
  }
}

export default Home;