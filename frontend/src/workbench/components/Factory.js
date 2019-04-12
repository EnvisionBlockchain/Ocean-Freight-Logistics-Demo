import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Loader, Dimmer, Form, Input, Message, Button, Card, Modal, Grid, Icon, Progress } from 'semantic-ui-react';
import AuthenticationContext from "adal-angular";
import {login} from "../helpers/utils";
import * as api from "../helpers/Api";
import { stateLabel } from "../helpers/utils";


//import web3 from '../ethereum/web3';
//import { FactoryInstance } from '../ethereum/factoryInstance';
//import { SupplyChainInstance as supplychain_instance } from '../ethereum/contractInstance';
//import { this.stateLabel } from "../utils";




class Factory extends Component {
  state = {
    msg: '',
    errorMessage: '',
    loadingData: false,
    account: '',  //TODO:figure out what this is
    description: '',
    freightCarrierAddress: '',
    originCustomsAddress: '',
    consigneeAddress: '',
    deployedChainsAddr: [],
    deployedChains: [],
    currentPage: 1,
    chainsPerPage: 4,
    apiKey: ""
  };
  
  config={
    clientId: '134a2a3a-6224-4584-93f6-b1f38ce5fbdc'
  };

  componentDidMount() {
    this.setState({ loadingData: true });
    let that=this;
    console.log("test did mount");
    let authContext = new AuthenticationContext(this.config);
    authContext.handleWindowCallback();
    //TODO:check if user is signed in
    let user = login(authContext);

    this.state.apiKey = this.getToken(authContext);
    api.run("GET", "/api/v2/contracts?workflowId=1", this.state.apiKey,
      function (err, _data) {
        if (!err) {
          //this.state.deployedChainsAddr = JSON.parse(_data).contracts;
          that.setState({'deployedChainsAddr':JSON.parse(_data).contracts});
          that.setState({ loadingData: false });
        } else {
          console.log(_data);
        }
      });
    this.setState({ loadingData: false });
  }

  getStage(transaction){
    //TODO:transaction list is pulling data that contains a transaction with ID:24
    //This is missing in the other app, figure this out
    if(transaction.id == "24"){
      return "UNKOWN";
    }
    let x=transaction.contractProperties[0].value;
    console.log(x);
    return x;
  }

  getSeller(transaction){
    let x=transaction.contractProperties[9].value;
    console.log(x);
    return x;
  }

  getDescription(transaction){
    if(transaction.id == "24"){
      return "UNKOWN";
    }
    let x=transaction.contractProperties[1].value;
    console.log(x);
    return x;
  }


  // async componentDidMount() {
  //   this.setstate({ loadingData: true });
  //   document.title = "Azure UI";
  //
  //   const accounts = await web3.eth.getAccounts();
  //   let deployedChainsAddr = await FactoryInstance.methods.getDeployedSupplyChain().call({ from: accounts[0] });
  //
  //
  //   let last = this.state.chainsPerPage;
  //   if (deployedChainsAddr.length < last) {
  //     last = deployedChainsAddr.length;
  //   }
  //
  //   let deployedChains = [];
  //   for (var i = 0; i < last; i++) {
  //     try {
  //       const SupplyChainInstance = await supplychain_instance(deployedChainsAddr[i]);
  //       const InstanceShipper = await SupplyChainInstance.methods.InstanceShipper().call({ from: accounts[0] });
  //       let metaData = await SupplyChainInstance.methods.getMetaData().call({ from: accounts[0] });
  //       deployedChains.push([deployedChainsAddr[i], metaData, InstanceShipper, i]);
  //     } catch (e) {
  //       //deployedChains.push([deployedChainsAddr[i], { _killed: true }, "0x0000", 0]);
  //     }
  //   }
  //
  //   this.setthis.state({ loadingData: false, account: accounts[0], deployedChainsAddr, deployedChains });
  // }
  //
  // getChains = async (first, last) => {
  //   this.state({ loadingData: true });
  //   const { account, deployedChainsAddr } = this.state;
  //
  //   if (last > this.state.deployedChainsAddr.length) {
  //     last = this.state.deployedChainsAddr.length;
  //   }
  //
  //   let deployedChains = [];
  //   for (var i = first; i < last; i++) {
  //     try {
  //       const SupplyChainInstance = await supplychain_instance(deployedChainsAddr[i]);
  //       const InstanceShipper = await SupplyChainInstance.methods.InstanceShipper().call({ from: account });
  //       let metaData = await SupplyChainInstance.methods.getMetaData().call({ from: account });
  //       deployedChains.push([deployedChainsAddr[i], metaData, InstanceShipper, i]);
  //     } catch (e) {
  //       //deployedChains.push([deployedChainsAddr[i], { _killed: true }, "0x0000", 0]);
  //     }
  //   }
  //
  //   this.setthis.state({ deployedChains, loadingData: false });
  // }
  //
  renderChains = () => {

    let defaultDescription="Defaule Description";

    //chainDets is just the current object, id is the id of the current element
    let items = this.state.deployedChainsAddr.map((chainDets, id) => {
      //TODO:confirm timeStamp and TimeSinceLastAction are equalivalent
      //will probably need to look at the contract list in each transaction object

      let seconds = parseInt(chainDets.timestamp, 10);
      let days = Math.floor(seconds / (3600 * 24));
      seconds -= days * 3600 * 24;
      let hrs = Math.floor(seconds / 3600);
      seconds -= hrs * 3600;
      let mnts = Math.floor(seconds / 60);
      seconds -= mnts * 60;

      let stage=this.getStage(chainDets);
      return (
        <Card key={id} fluid style={{ overflowWrap: 'break-word' }}>
          <Card.Content>
            <Card.Header>Address: {chainDets.ledgerIdentifier}</Card.Header>
            <Card.Meta>Time since last action: <b>{days} days {hrs} hrs {mnts} min {seconds} sec</b></Card.Meta>
            <Card.Description>Description: {this.getDescription(chainDets)}</Card.Description>
            {(stage == '11' &&
              <div>
                <Card.Description>Stage: {parseInt(stage, 10) + 1}/11 (<span style={{ "color": "red" }}>{stateLabel[stage][0]}</span>)</Card.Description><br />
                <Progress value={stage} total='10' indicating />
                <Link to={{
                  pathname: `/UI-project/${chainDets}`,
                  state: {
                    metaData: "<insert meta data>",
                    InstanceShipper: this.getSeller(chainDets),
                    //confirm this is ID
                    contractNo: chainDets.id
                  }
                }}>
                  <Button primary icon labelPosition="right" floated="right"><Icon name='right arrow' />Details</Button>
                </Link>
              </div>) ||
              <div>Stage: <span style={{ "color": "red" }}>Terminated</span></div>
            }

            {this.state.account === "account" &&
              <Button loading={this.state.loading} disabled={this.state.loading} basic color='red' icon labelPosition="left" floated='right' onClick={() => this.deleteContract(chainDets[0])}><Icon name="warning sign" />Delete</Button>
            }
          </Card.Content>
        </Card>
      );
    });

    return <Card.Group>{items}</Card.Group>;
  };
  //
  // handleClick = (event) => {
  //   const currentPage = Number(event.target.id);
  //   const indexOfLastChain = currentPage * this.state.chainsPerPage;
  //   const indexOfFirstChain = indexOfLastChain - this.state.chainsPerPage;
  //
  //   this.getChains(indexOfFirstChain, indexOfLastChain);
  //   this.setthis.state({ currentPage });
  // }
  //
  // deleteContract = async (address) => {
  //   this.setthis.state({ loading: true });
  //   try {
  //     const SupplyChainInstance = await supplychain_instance(address);
  //     await SupplyChainInstance.methods.kill().send({ from: this.state.account });
  //   } catch (e) {
  //     this.setthis.state({ errorMessage: e.message });
  //   }
  //   this.setthis.state({ loading: false });
  // }
  //
  // onSubmit = async (event) => {
  //   event.preventDefault();
  //   this.setthis.state({ errorMessage: '', loading: true, msg: '' });
  //
  //   try {
  //     let { description, freightCarrierAddress, originCustomsAddress, consigneeAddress, account } = this.state;
  //     await FactoryInstance.methods.createSupplyChain(description, freightCarrierAddress, originCustomsAddress, consigneeAddress).send({ from: account });
  //     this.setthis.state({ msg: 'Contract deployed successfully!' });
  //   } catch (err) {
  //     this.setthis.state({ errorMessage: err.message });
  //   }
  //
  //   this.setthis.state({ loading: false });
  // }
  //
  render() {
    let retVal="";
    let statusMessage="";
    let renderPageNumbers="";
    let pageNumbers="";
    let that = this;
    //TODO: separate the different versions of the app
    //TODO: possible extract auth context stuff into a function


    statusMessage=that.checkStatusMessage();

    pageNumbers=that.checkPageNumbers();

    that.renderPageNumbers(pageNumbers);

    console.log(this.state.deployedChainsAddr);
    return (
   <div>
    <h1>Deployed Supply Chain Transportation Contracts</h1>
    <Grid stackable reversed='mobile'>
      <Grid.Row>
        <Grid.Column width={12}>
          {(this.state.deployedChainsAddr.length > 0 && this.renderChains()) || <b>No contracts deployed!</b>}
        </Grid.Column>
        {/*<Grid.Column width={4}>*/}
          {/*<Grid.Row>*/}
            {/*<Modal trigger={<Button primary icon labelPosition='right'><Icon name='plus circle' />Deploy New Supplychain</Button>}>*/}
              {/*<Modal.Header>Supplychain Transportation Factory</Modal.Header>*/}
              {/*<Modal.Content>*/}
                {/*<Form onSubmit={that.onSubmit} error={!!this.state.errorMessage}>*/}
                  {/*<Form.Field>*/}
                    {/*<label>Description</label>*/}
                    {/*<Input onChange={event => that.setthis.state({ description: event.target.value })} />*/}
                  {/*</Form.Field>*/}
                  {/*<Form.Field>*/}
                    {/*<label>Freight Carrier Address</label>*/}
                    {/*<Input onChange={event => that.setthis.state({ freightCarrierAddress: event.target.value })} />*/}
                  {/*</Form.Field>*/}
                  {/*<Form.Field>*/}
                    {/*<label>Origin Customs Address</label>*/}
                    {/*<Input onChange={event => that.setthis.state({ originCustomsAddress: event.target.value })} />*/}
                  {/*</Form.Field>*/}
                  {/*<Form.Field>*/}
                    {/*<label>Consignee Address</label>*/}
                    {/*<Input onChange={event => that.setthis.state({ consigneeAddress: event.target.value })} />*/}
                  {/*</Form.Field>*/}
                  {/*<Button loading={this.state.loading} disabled={this.state.loading} primary basic type='submit'>Deploy</Button>*/}
                  {/*<Message error header="Oops!" content={this.state.errorMessage} />*/}
                  {/*{statusMessage}*/}
                {/*</Form>*/}
              {/*</Modal.Content>*/}
            {/*</Modal>*/}
          {/*</Grid.Row>*/}
        {/*</Grid.Column>*/}
      {/*</Grid.Row>*/}
      {/*<Grid.Row centered>*/}
        {/*<Button.Group>*/}
          {/*{renderPageNumbers}*/}
        {/*</Button.Group>*/}
      </Grid.Row>
    </Grid>
  </div>);
  }

  isLoading() {
    if (this.state.loadingData) {
      return (
        <Dimmer active inverted>
          <Loader size='massive'>Loading...</Loader>
        </Dimmer>
      );
    }
    else {
      return null;
    }
  }
    checkStatusMessage() {
      let statusMessage; //TODO:change this to class scope
      if (this.state.msg === '') {
        statusMessage = null;
      } else {
        statusMessage = <Message floating positive header={this.state.msg} />;
      }
      return statusMessage;
    }

    checkPageNumbers() {
      const pageNumbers = [];
      for (let i = 1; i <= Math.ceil(this.state.deployedChainsAddr.length / this.state.chainsPerPage); i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }

    renderPageNumbers(pageNumbers) {
      const renderPageNumbers = pageNumbers.map(number => {
        return (
          <Button key={number} id={number} onClick={this.handleClick}>{number}</Button>
        );
      });
    }

  //TODO:redesign all login/authcontext code
  getToken(authContext) {
    let token='';
    this.state.apiKey = authContext.acquireToken(this.config.clientId, function (err, accessToken) {
        if (!err) {
          token = accessToken;
        }
        else {
          //TODO:stop ignoring error
        }
      }
    );
    return token;
  }
}

export default Factory;
