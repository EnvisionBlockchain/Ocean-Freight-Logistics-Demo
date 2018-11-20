import React, { Component } from 'react';
import {Loader, Dimmer, Button, Modal, Message} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import {SupplyChainInstance} from '../ethereum/contractInstance';
import SendForExportClearance from '../stages/1_begin_trade';
import ExportClearanceAction from '../stages/2_export_clearance';

class Home extends Component {
    state = {
    msg:'',
    loadingData:false,
    account:'',
    contractState:'',
    instanceShipper:'',
    instanceOriginCustoms:'',
  }

  async componentDidMount(){
    this.setState({loadingData:true});
    document.title = "Azure UI";

    const accounts = await web3.eth.getAccounts();
    let contractState = await SupplyChainInstance.methods.State().call({from:accounts[0]});
    let instanceShipper = await SupplyChainInstance.methods.InstanceShipper().call({from:accounts[0]});
    let instanceOriginCustoms = await SupplyChainInstance.methods.InstanceOriginCustoms().call({from:accounts[0]});

    this.setState({loadingData:false, account:accounts[0], contractState, instanceShipper, instanceOriginCustoms});
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
        {this.state.instanceShipper===this.state.account && this.state.contractState==='0' &&
          <SendForExportClearance account={this.state.account} />
        }

        {this.state.instanceOriginCustoms===this.state.account && this.state.contractState==='1' &&
          <ExportClearanceAction account={this.state.account} />
        }

      </div>
    );
  }
}

export default Home;