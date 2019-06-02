import React, { Component } from "react";
import { Loader, Dimmer, Table, Header, Grid } from "semantic-ui-react";
//import web3 from "../ethereum/web3";
//import { SupplyChainInstance as supplychain_instance } from "../ethereum/contractInstance";
import {stateLabel, calDateTime, functionIdMap} from "../helpers/utils";
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
import * as api from "../helpers/Api";

class Home extends Component {
  state = {
    msg: '',
    loadingData: false,   //takes a while for it to fetch data, untill it fetches the data it shows loading symbol
    account: '',
    SupplyChainInstance: '',  //factory page has several contracts, contract needs to be fetched with instance, binary code and address
    contractState: '',        //11 stages
    instanceShipper: '',      //address of instance shipper
    instanceOriginCustoms: '', //address of origin customs
    metaData: { _lastAction: [] }, //contract variables
    allAddress: [],    //all of the addresses associated with the contract
  };

  async componentDidMount() {
    let currentAccount=null;
    let allUsers=[];
    this.setState({ loadingData: true });
    document.title = "Azure UI";

    console.log(this.props.location.state);

    let SupplyChainInstance=this.props.match.params.id;

    if(this.props.location.state == null){
      console.log("Cannot route directly too a contract page");
      window.location.href="/";
    }
    let data=this.props.location.state.data;


    this.setState({
      loadingData:false,
      SupplyChainInstance,
      contractState:data.contractProperties[0].value,
      instanceShipper:data.contractProperties[2].value,

      account:this.props.location.state.account,
      data:data,
      token:this.props.location.state.token,
      users:this.props.location.state.users,
    });
    this.setState({ loadingData: false });
  }

  async getData(id){
    let account=await api.getUserData(this.state.apiKey);
    let contract=await api.getContract(this.state.apiKey, id);
    let users=await api.getAllUsers(this.state.apiKey);

    this.setState({
      account:account,
      data:contract,
      token:this.state.apiKey,
      users:users,
    })

  }


  purgeContractsActions(contractActions){
    let arr = [];
    for(let i=0; i < contractActions.length; i++){
      if(contractActions[i].workflowStateId != null){
        arr.push(contractActions[i]);
      }
    }
    return arr;
  };

  getAddressPerRole(role){
    switch (role) {
      case 'Shipper':
        return this.state.data.contractProperties[2].value;
      case 'Freight Carrier':
        return this.state.data.contractProperties[3].value;
      case 'Origin Customs':
        return this.state.data.contractProperties[4].value;
      case 'Drayage Agent':
        return this.state.data.contractProperties[5].value;
      case 'Destination Customs Broker':
        return this.state.data.contractProperties[6].value;
      case 'Destination Customs':
        return this.state.data.contractProperties[7].value;
      case 'Consignee':
        return this.state.data.contractProperties[8].value;
      case 'Seller':
        return this.state.data.contractProperties[9].value;
    }
  }

  canUserTakeAction(action){
    let role=functionIdMap[action.workflowFunctionId][1];
    return this.getAddressPerRole(role) === this.state.account;

  }

  renderStatus = () => {
    let arr = this.purgeContractsActions(this.state.data.contractActions);
    let arrLen = arr.length;
    let items = arr.map((action, id) => {
    let dateTime = calDateTime(Date.parse(action.timestamp)/1000);

    if (this.canUserTakeAction(action) && arrLen === id + 1) {
      return (
        <Table.Row key={id}>
          <Table.Cell>
            <Header as='h4'>
              <Header.Content>
                <span style={{ color: "red" }}>{id + 1}. {functionIdMap[action.workflowFunctionId][0]}</span>
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
            {functionIdMap[action.workflowFunctionId][1]}
          </Table.Cell>
        </Table.Row>
        );
      } else {
      return (
        <Table.Row key={id}>
          <Table.Cell>
            <Header as='h4'>
              <Header.Content>
                {id + 1}.  {functionIdMap[action.workflowFunctionId][0]}
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
            {functionIdMap[action.workflowFunctionId][1]}
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
  };

  getOriginCustoms(){
    return this.state.data.contractProperties[4].value;
  }

  getFreightCarrier(){
    return this.state.data.contractProperties[3].value;
  }

  getDestinationCustomBroker(){
    return this.state.data.contractProperties[6].value;
  }

  getDestinationCustoms(){
    return this.state.data.contractProperties[7].value;
  }

  getDrayageAgent(){
    return this.state.data.contractProperties[5].value;
  }

  getConsignee(){
    return this.state.data.contractProperties[8].value;
  }


  render() {
    const { account } = this.state;
    const { contractState} = this.state;

    //console.log(this.props.location.state.token);

    if (this.state.loadingData || typeof stateLabel[contractState] === "undefined") {
      return (
        <Dimmer active inverted>
          <Loader size='massive'>Loading...</Loader>
        </Dimmer>
      );
    }
    let dateTime = calDateTime(Date.parse(this.state.data.timestamp)/1000);
    console.log("account= " + account, "instance Shipper= "+ this.state.instanceShipper);
    return (
      <div>
        <h1>Supplychain Transportation #{this.state.data.id + 1}</h1>
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
                        Contract ID
                      </Header.Content>
                    </Header>
                  </Table.Cell>
                  <Table.Cell>{this.state.data.id}</Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell>
                    <Header as='h4'>
                      <Header.Content>
                        Contract #
                      </Header.Content>
                    </Header>
                  </Table.Cell>
                  {/*make sure ledgerIdentifier and Contract # are equal*/}
                  <Table.Cell>{this.state.data.ledgerIdentifier}</Table.Cell>
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
                  <Table.Cell>{this.state.data.contractProperties[1].value}</Table.Cell>
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
                  <Table.Cell>{this.state.data.contractProperties[2].value}</Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell>
                    <Header as='h4'>
                      <Header.Content>
                        Freight Carrier
                      </Header.Content>
                    </Header>
                  </Table.Cell>
                  <Table.Cell>{this.state.data.contractProperties[3].value}</Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell>
                    <Header as='h4'>
                      <Header.Content>
                        Origin Customs
                      </Header.Content>
                    </Header>
                  </Table.Cell>
                  <Table.Cell>{this.state.data.contractProperties[4].value}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>

          {this.renderStatus()}
        </Grid>

         <h3>Pending Action: </h3>
        {this.state.instanceShipper === account && contractState === '0' &&
        <SendForExportClearance account={account} SupplyChainInstance={this.state.SupplyChainInstance}
                                token={this.state.token} id={this.state.data.id}
                                users={this.state.users}/>
        }

        {this.getOriginCustoms() === account && contractState === '1' &&
        <ExportClearanceAction account={account} SupplyChainInstance={this.state.SupplyChainInstance}
                               token={this.state.token} id={this.state.data.id}/>
        }

         {this.state.instanceShipper === account && contractState === '2' &&
           <InitiateShipment account={account} SupplyChainInstance={this.state.SupplyChainInstance}
                             token={this.state.token} id={this.state.data.id}/>
         }

         {this.getFreightCarrier() === account && contractState === '3' &&
           <BoardingShipment account={account} SupplyChainInstance={this.state.SupplyChainInstance}
                             token={this.state.token} id={this.state.data.id}/>
         }

         {this.getFreightCarrier() === account && contractState === '4' &&
           <TransferLading account={account} SupplyChainInstance={this.state.SupplyChainInstance}
                           token={this.state.token} id={this.state.data.id}
                           users={this.state.users}/>
         }

         {this.getDestinationCustomBroker() === account && contractState === '5' &&
           <ShipmentTransit account={account} SupplyChainInstance={this.state.SupplyChainInstance}
                            token={this.state.token} id={this.state.data.id}
                            users={this.state.users}/>
         }

         {this.getDestinationCustoms() === account && contractState === '6' &&
           <ImportClearance account={account} SupplyChainInstance={this.state.SupplyChainInstance}
                            token={this.state.token} id={this.state.data.id}/>
         }

         {this.getDestinationCustomBroker() === account && contractState === '7' &&
           <RecoverOrder account={account} SupplyChainInstance={this.state.SupplyChainInstance}
                         token={this.state.token} id={this.state.data.id}/>
         }

         {this.getDrayageAgent() === account && contractState === '8' &&
           <DeliveryOrder account={account} SupplyChainInstance={this.state.SupplyChainInstance}
                          token={this.state.token} id={this.state.data.id}/>
         }

         {this.getConsignee() === account && contractState === '9' &&
           <ApproveDelivery account={account} SupplyChainInstance={this.state.SupplyChainInstance}
                            token={this.state.token} id={this.state.data.id}/>
         }

         <br /><br />
       </div>
    );
  }
}

export default Home;
