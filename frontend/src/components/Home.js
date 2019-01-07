import React, { Component } from "react";
import {Loader, Dimmer} from "semantic-ui-react";
import web3 from "../ethereum/web3";
import {SupplyChainInstance as supplychain_instance} from "../ethereum/contractInstance";
import SendForExportClearance from "../stages/1_begin_trade";
import ExportClearanceAction from "../stages/2_export_clearance";
import InitiateShipment from "../stages/3_shipment_initiation";
import BoardingShipment from "../stages/4_shipment_boarding";

class Home extends Component {
    state = {
    msg:'',
    loadingData:false,
    account:'',
    SupplyChainInstance:'',
    contractState:'',
    instanceShipper:'',
    instanceOriginCustoms:'',
  }

  async componentDidMount(){
    this.setState({loadingData:true});
    document.title = "Azure UI";

    const accounts = await web3.eth.getAccounts();
    const SupplyChainInstance = await supplychain_instance(this.props.match.params.chainAddress);
    let contractState = await SupplyChainInstance.methods.State().call({from:accounts[0]});
    
    let instanceOriginCustoms = await SupplyChainInstance.methods.InstanceOriginCustoms().call({from:accounts[0]});
    let instanceShipper = await SupplyChainInstance.methods.InstanceShipper().call({from:accounts[0]});
    let instanceFreightCarrier = await SupplyChainInstance.methods.InstanceFreightCarrier().call({from: accounts[0]});

    this.setState({loadingData:false, account:accounts[0], SupplyChainInstance, contractState, instanceShipper, instanceOriginCustoms, instanceFreightCarrier});
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
          <SendForExportClearance account={this.state.account} SupplyChainInstance={this.state.SupplyChainInstance} />
        }

        {this.state.instanceOriginCustoms===this.state.account && this.state.contractState==='1' &&
          <ExportClearanceAction account={this.state.account} SupplyChainInstance={this.state.SupplyChainInstance} />
        }

        {this.state.instanceShipper===this.state.account && this.state.contractState==='2' &&
          <InitiateShipment account={this.state.account} SupplyChainInstance={this.state.SupplyChainInstance} />
        }

        {this.state.instanceFreightCarrier===this.state.account && this.state.contractState==='3' &&
          <BoardingShipment account={this.state.account} SupplyChainInstance={this.state.SupplyChainInstance} />
        }
      </div>
    );
  }
}

export default Home;