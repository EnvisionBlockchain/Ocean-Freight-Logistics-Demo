import React, { Component } from "react";
import { Loader, Dimmer, Table, Header, Grid } from "semantic-ui-react";
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
    metaData: { _lastAction: [] },
    allAddress: [],
  }

  async componentDidMount() {
    this.setState({ loadingData: true });
    document.title = "Cargo Shipmemnt";

    const accounts = await web3.eth.getAccounts();
    const SupplyChainInstance = await supplychain_instance(this.props.match.params.chainAddress);
    let metaData = this.props.location.state.metaData;
    this.setState({ metaData });
    metaData = await SupplyChainInstance.methods.getMetaData().call();

    let instanceShipper = this.props.location.state.InstanceShipper;
    let allAddress = await SupplyChainInstance.methods.getAllAddress().call();
    //let { instanceOriginCustoms, instanceFreightCarrier, instanceDestinationCustoms, instanceDestinationCustomsBroker, instanceDrayageAgent, instanceConsignee } = Object.values(allAddress);

    this.setState({ loadingData: false, account: accounts[0], allAddress, SupplyChainInstance, metaData, contractState: metaData._State, instanceShipper });
  }

  renderStatus = () => {
    let arr = this.state.metaData._lastAction;
    let arrLen = arr.length;
    let items = arr.map((action, id) => {
      let dateTime = calDateTime(action);

      if (arrLen !== id + 1) {
        return (
          <Table.Row key={id}>
            <Table.Cell>
              <Header as='h4'>
                <Header.Content>
                  {id + 1}. {stateLabel[id.toString()][0]}
                </Header.Content>
              </Header>
            </Table.Cell>
            <Table.Cell>
              {dateTime[0]}
            </Table.Cell>
            <Table.Cell>
              {dateTime[1]}
            </Table.Cell>
            <Table.Cell>
              {stateLabel[id.toString()][1]}
            </Table.Cell>
          </Table.Row>
        );
      } else {
        return (
          <Table.Row key={id}>
            <Table.Cell>
              <Header as='h4'>
                <Header.Content>
                  <span style={{ color: "red" }}>{id + 1}. {stateLabel[id.toString()][0]}</span>
                </Header.Content>
              </Header>
            </Table.Cell>
            <Table.Cell>
              {dateTime[0]}
            </Table.Cell>
            <Table.Cell>
              {dateTime[1]}
            </Table.Cell>
            <Table.Cell>
              {stateLabel[id.toString()][1]}
            </Table.Cell>
          </Table.Row>
        );
      }
    });

    return (
      <Table basic='very' celled collapsing>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              <Header as='h2'>Status</Header>
            </Table.HeaderCell>
            <Table.HeaderCell><Header as='h4'>Date</Header></Table.HeaderCell>
            <Table.HeaderCell><Header as='h4'>Time</Header></Table.HeaderCell>
            <Table.HeaderCell><Header as='h4'>Role</Header></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{items}</Table.Body>
      </Table>
    );
  }

  render() {
    const { contractState, metaData, account } = this.state;
    if (this.state.loadingData || typeof stateLabel[contractState] === "undefined") {
      return (
        <Dimmer active inverted>
          <Loader size='massive'>Loading...</Loader>
        </Dimmer>
      );
    }

    let dateTime = calDateTime(metaData._lastAction[0]);
    return (
      <div>
        <h1>Supply Chain Transportation #{this.props.location.state.contractNo + 1}</h1>
        <h3>Contract State:<span style={{ "color": "red" }}> {stateLabel[contractState][0]}</span></h3>

        <Grid stackable reversed="mobile">
          <Grid.Column mobile={16} computer={8}>
            <Table striped celled collapsing>
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
                        Created on
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
                      <Header.Subheader>(Shipper)</Header.Subheader>
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
                  <Table.Cell>{this.state.allAddress[1]}</Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell>
                    <Header as='h4'>
                      <Header.Content>
                        Origin Customs
                      </Header.Content>
                    </Header>
                  </Table.Cell>
                  <Table.Cell>{this.state.allAddress[0]}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>

          {this.renderStatus()}
        </Grid>

        {this.state.instanceShipper === account && contractState === '0' &&
          <SendForExportClearance account={account} SupplyChainInstance={this.state.SupplyChainInstance} />
        }

        {this.state.allAddress[0] === account && contractState === '1' &&
          <ExportClearanceAction account={account} SupplyChainInstance={this.state.SupplyChainInstance} />
        }

        {this.state.instanceShipper === account && contractState === '2' &&
          <InitiateShipment account={account} SupplyChainInstance={this.state.SupplyChainInstance} />
        }

        {this.state.allAddress[1] === account && contractState === '3' &&
          <BoardingShipment account={account} SupplyChainInstance={this.state.SupplyChainInstance} />
        }

        {this.state.allAddress[1] === account && contractState === '4' &&
          <TransferLading account={account} SupplyChainInstance={this.state.SupplyChainInstance} />
        }

        {this.state.allAddress[3] === account && contractState === '5' &&
          <ShipmentTransit account={account} SupplyChainInstance={this.state.SupplyChainInstance} />
        }

        {this.state.allAddress[2] === account && contractState === '6' &&
          <ImportClearance account={account} SupplyChainInstance={this.state.SupplyChainInstance} />
        }

        {this.state.allAddress[3] === account && contractState === '7' &&
          <RecoverOrder account={account} SupplyChainInstance={this.state.SupplyChainInstance} />
        }

        {this.state.allAddress[4] === account && contractState === '8' &&
          <DeliveryOrder account={account} SupplyChainInstance={this.state.SupplyChainInstance} />
        }

        {this.state.allAddress[5] === account && contractState === '9' &&
          <ApproveDelivery account={account} SupplyChainInstance={this.state.SupplyChainInstance} />
        }

        <br /><br />
      </div>
    );
  }
}

export default Home;