import React, { Component } from "react";
import { Loader, Dimmer } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import { SupplyChainInstance as supplychain_instance } from "../ethereum/contractInstance";
import { stateLabel } from "../utils";
import SendForExportClearance from "../stages/1_begin_trade";
import ExportClearanceAction from "../stages/2_export_clearance";
import InitiateShipment from "../stages/3_shipment_initiation";
import BoardingShipment from "../stages/4_shipment_boarding";
import TransferLading from "../stages/5_transfer_lading";
import ShipmentTransit from "../stages/6_shipment_transit";
import ImportClearance from "../stages/7_import_clearance";
import RecoverOrder from "../stages/8_recover_order";
import DeliveryOrder from "../stages/9_delivery_shipment";
import ApproveDelivery from "../stages/10_approve_delivery";

class Home extends Component {
  state = {
    msg: '',
    loadingData: false,
    account: '',
    SupplyChainInstance: '',
    contractState: '',
    instanceShipper: '',
    instanceOriginCustoms: '',
  }

  async componentDidMount() {
    this.setState({ loadingData: true });
    document.title = "Azure UI";

    const accounts = await web3.eth.getAccounts();
    const SupplyChainInstance = await supplychain_instance(this.props.match.params.chainAddress);
    let contractState = await SupplyChainInstance.methods.State().call({ from: accounts[0] });

    let instanceOriginCustoms = await SupplyChainInstance.methods.InstanceOriginCustoms().call({ from: accounts[0] });
    let instanceShipper = await SupplyChainInstance.methods.InstanceShipper().call({ from: accounts[0] });
    let instanceFreightCarrier = await SupplyChainInstance.methods.InstanceFreightCarrier().call({ from: accounts[0] });
    let instanceDestinationCustoms = await SupplyChainInstance.methods.InstanceDestinationCustoms().call({ from: accounts[0] });
    let instanceDestinationCustomsBroker = await SupplyChainInstance.methods.InstanceDestinationCustomsBroker().call({ from: accounts[0] });
    let instanceDrayageAgent = await SupplyChainInstance.methods.InstanceDrayageAgent().call({ from: accounts[0] });
    let instanceConsignee = await SupplyChainInstance.methods.InstanceConsignee().call({ from: accounts[0] });

    this.setState({ loadingData: false, account: accounts[0], SupplyChainInstance, contractState, instanceShipper, instanceOriginCustoms, instanceFreightCarrier, instanceDestinationCustoms, instanceDestinationCustomsBroker, instanceDrayageAgent, instanceConsignee });
  }

  render() {
    if (this.state.loadingData) {
      return (
        <Dimmer active inverted>
          <Loader size='massive'>Loading...</Loader>
        </Dimmer>
      );
    }

    const { contractState } = this.state;

    return (
      <div>
        <h1>Supplychain Transportation</h1>

        <h3>Contract State:<span style={{ "color": "red" }}> {stateLabel[contractState]}</span></h3>

        {this.state.instanceShipper === this.state.account && contractState === '0' &&
          <SendForExportClearance account={this.state.account} SupplyChainInstance={this.state.SupplyChainInstance} />
        }

        {this.state.instanceOriginCustoms === this.state.account && contractState === '1' &&
          <ExportClearanceAction account={this.state.account} SupplyChainInstance={this.state.SupplyChainInstance} />
        }

        {this.state.instanceShipper === this.state.account && contractState === '2' &&
          <InitiateShipment account={this.state.account} SupplyChainInstance={this.state.SupplyChainInstance} />
        }

        {this.state.instanceFreightCarrier === this.state.account && contractState === '3' &&
          <BoardingShipment account={this.state.account} SupplyChainInstance={this.state.SupplyChainInstance} />
        }

        {this.state.instanceFreightCarrier === this.state.account && contractState === '4' &&
          <TransferLading account={this.state.account} SupplyChainInstance={this.state.SupplyChainInstance} />
        }

        {this.state.instanceDestinationCustomsBroker === this.state.account && contractState === '5' &&
          <ShipmentTransit account={this.state.account} SupplyChainInstance={this.state.SupplyChainInstance} />
        }

        {this.state.instanceDestinationCustoms === this.state.account && contractState === '6' &&
          <ImportClearance account={this.state.account} SupplyChainInstance={this.state.SupplyChainInstance} />
        }

        {this.state.instanceDestinationCustomsBroker === this.state.account && contractState === '7' &&
          <RecoverOrder account={this.state.account} SupplyChainInstance={this.state.SupplyChainInstance} />
        }

        {this.state.instanceDrayageAgent === this.state.account && contractState === '8' &&
          <DeliveryOrder account={this.state.account} SupplyChainInstance={this.state.SupplyChainInstance} />
        }

        {this.state.instanceConsignee === this.state.account && contractState === '9' &&
          <ApproveDelivery account={this.state.account} SupplyChainInstance={this.state.SupplyChainInstance} />
        }

      </div>
    );
  }
}

export default Home;