import React, { Component } from "react";
import { Loader, Dimmer, Table, Header, Label } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import { SupplyChainInstance as supplychain_instance } from "../ethereum/contractInstance";
import { stateLabel, calDateTime } from "../utils";
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
    let metaData = this.props.location.state.metaData;

    let instanceOriginCustoms = await SupplyChainInstance.methods.InstanceOriginCustoms().call({ from: accounts[0] });
    let instanceShipper = this.props.location.state.InstanceShipper;
    let instanceFreightCarrier = await SupplyChainInstance.methods.InstanceFreightCarrier().call({ from: accounts[0] });
    let instanceDestinationCustoms = await SupplyChainInstance.methods.InstanceDestinationCustoms().call({ from: accounts[0] });
    let instanceDestinationCustomsBroker = await SupplyChainInstance.methods.InstanceDestinationCustomsBroker().call({ from: accounts[0] });
    let instanceDrayageAgent = await SupplyChainInstance.methods.InstanceDrayageAgent().call({ from: accounts[0] });
    let instanceConsignee = await SupplyChainInstance.methods.InstanceConsignee().call({ from: accounts[0] });

    this.setState({ loadingData: false, account: accounts[0], SupplyChainInstance, contractState: metaData._State, instanceShipper, instanceOriginCustoms, instanceFreightCarrier, instanceDestinationCustoms, instanceDestinationCustomsBroker, instanceDrayageAgent, instanceConsignee });
  }

  renderStatus = () => {
    let arr = this.props.location.state.metaData._lastAction;
    let arrLen = arr.length;
    let items = arr.map((action, id) => {
      let dateTime = calDateTime(action);

      if (arrLen !== id + 1) {
        return (
          <Table.Row key={id}>
            <Table.Cell>
              <Header as='h4'>
                <Header.Content>
                  {id + 1}. {stateLabel[id.toString()]}
                </Header.Content>
              </Header>
            </Table.Cell>
            <Table.Cell>
              {dateTime[0]}
            </Table.Cell>
            <Table.Cell>
              {dateTime[1]}
            </Table.Cell>
          </Table.Row>
        );
      } else {
        return (
          <Table.Row key={id}>
            <Table.Cell>
              <Header as='h4'>
                <Header.Content>
                  <Label ribbon>{id + 1}. {stateLabel[id.toString()]}</Label>
                </Header.Content>
              </Header>
            </Table.Cell>
            <Table.Cell>
              {dateTime[0]}
            </Table.Cell>
            <Table.Cell>
              {dateTime[1]}
            </Table.Cell>
          </Table.Row>
        );
      }
    });

    return <Table.Body>{items}</Table.Body>;
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
    let dateTime = calDateTime(this.props.location.state.metaData._lastAction[0]);
    return (
      <div>
        <h1>Supplychain Transportation #{this.props.location.state.contractNo + 1}</h1>
        <h3>Contract State:<span style={{ "color": "red" }}> {stateLabel[contractState]}</span></h3>

        <Table basic='very' celled collapsing>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <Header as='h2'>Details</Header>
              </Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell>
                <Header as='h4'>
                  <Header.Content>
                    Contract Address
                  </Header.Content>
                </Header>
              </Table.Cell>
              <Table.Cell>{this.props.match.params.chainAddress}</Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell>
                <Header as='h4'>
                  <Header.Content>
                    Contract #
                  </Header.Content>
                </Header>
              </Table.Cell>
              <Table.Cell>{this.props.location.state.contractNo + 1}</Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell>
                <Header as='h4'>
                  <Header.Content>
                    Create on
                  </Header.Content>
                </Header>
              </Table.Cell>
              <Table.Cell>{dateTime[0]} {dateTime[1]}</Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell>
                <Header as='h4'>
                  <Header.Content>
                    Description
                  </Header.Content>
                </Header>
              </Table.Cell>
              <Table.Cell>{this.props.location.state.metaData._Description}</Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell>
                <Header as='h4'>
                  <Header.Content>
                    Deployed By
                    <Header.Subheader>Instance Shipper</Header.Subheader>
                  </Header.Content>
                </Header>
              </Table.Cell>
              <Table.Cell>{this.props.location.state.InstanceShipper}</Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell>
                <Header as='h4'>
                  <Header.Content>
                    Freight Carrier
                  </Header.Content>
                </Header>
              </Table.Cell>
              <Table.Cell>{this.state.instanceFreightCarrier}</Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell>
                <Header as='h4'>
                  <Header.Content>
                    Origin Customs
                  </Header.Content>
                </Header>
              </Table.Cell>
              <Table.Cell>{this.state.instanceOriginCustoms}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>

        <Table striped celled collapsing>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <Header as='h2'>Status</Header>
              </Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          {this.renderStatus()}
        </Table>

        <h3>Pending Action:</h3>

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

        <br /><br />
      </div>
    );
  }
}

export default Home;