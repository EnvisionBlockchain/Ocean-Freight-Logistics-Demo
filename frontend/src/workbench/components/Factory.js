/*
  This class/component is used to render the main page of the application, the list of contracts
  and set links for each individual contract instance.

  Author: Steve Flynn
*/
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Loader, Dimmer, Message, Button, Card, Grid, Icon, Progress, Modal, Form, Input } from 'semantic-ui-react';
import {getTime, stateLabel, timezone} from "../helpers/utils";
import AdUser from "../helpers/users";
import * as api from "../helpers/Api";
import Dropdown from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";

class Factory extends Component {
  state = {
    msg: '',
    errorMessage: '',
    loadingData: false,
    account: '',
    description: '',
    freightCarrierAddress: '',
    originCustomsAddress: '',
    consigneeAddress: '',
    deployedChainsAddr: [],
    deployedChains: [],
    currentPage: 1,
    chainsPerPage: 4,
    apiKey: "",
    user: null,
    allUsers:null,
    selectedOption:"asdf"
  };

  async componentDidMount() {
    this.setState({loadingData: true});
    let deployedChainsAddr=[];
    let currentAccount;
    let allUsers;
    let that=this;

    this.state.user = new AdUser();
    this.state.apiKey = this.state.user.getToken();
    if (this.state.apiKey === "ERROR") {
      console.log("Error in retrieving key");
    }

    currentAccount = await api.getUserData(this.state.apiKey);
    allUsers=await api.getAllUsers(this.state.apiKey);

    //deployedChainsAddr= await api.getAllContracts(this.state.apiKey);
    this.getContracts().then(function(value){
      deployedChainsAddr=value;
      deployedChainsAddr=that.verifyAllContracts(deployedChainsAddr);

      that.setState({deployedChains:that.setChains(deployedChainsAddr),
        deployedChainsAddr:deployedChainsAddr,loadingData: false, account:currentAccount,
        allUsers:that.createUserList(allUsers)});
    });

  }

  async getContracts(){
    let contracts=[];
    let path="/api/v2/contracts?top=50";
    let stop=false;

    while(!stop){
      let data=await api.getAllContracts(this.state.apiKey,path);
      if(data.status === 204){stop=true; continue;}
      contracts=contracts.concat(data.data.contracts);
      path=data.data.nextLink;
    }
    return Promise.resolve(contracts);
  }

  createUserList(users){
    let newList=[];
    for(let i=0; i < users.length; i++){
      newList.push({text:users[i].firstName + " " + users[i].lastName,
                    value:users[i].userChainMappings[0].chainIdentifier});
    }
    return newList;
  }

  verifyAllContracts(contractList){
    let retList=[];
    for(let i=0; i < contractList.length; i++){
      if(this.verifyContract(contractList[i])){
        retList.push(contractList[i]);
      }
    }
    return retList;
  }

  verifyContract(contract){
    return (getTime(contract) && this.getStage(contract) &&
      this.getDescription(contract));

  }

  setChains(deployedChainsAddr){
    let last = this.state.chainsPerPage;
    if (deployedChainsAddr.length < last) {
      last = deployedChainsAddr.length;
    }
    let deployedChains=[];
    for (let i = 0; i < last; i++) {
      try {
        deployedChains.push(deployedChainsAddr[i]);
      } catch (e) {
        //deployedChains.push([deployedChainsAddr[i], { _killed: true }, "0x0000", 0]);
      }
    }
    return deployedChains;
  }


  getStage(transaction){
    if(transaction.contractProperties.length === 0){
      return false;
    }
    return transaction.contractProperties[0].value;
  }

  getDescription(transaction){
    if(transaction.contractProperties.length === 0){
      return false;
    }
    return transaction.contractProperties[1].value;
  }


  getChains = async (first, last) => {
    this.setState({ loadingData: true });
    const { account, deployedChainsAddr } = this.state;

    if (last > this.state.deployedChainsAddr.length) {
      last = this.state.deployedChainsAddr.length;
    }

    let deployedChains = [];
    for (var i = first; i < last; i++) {
      try {
        deployedChains.push(deployedChainsAddr[i]);
      } catch (e) {
        //deployedChains.push([deployedChainsAddr[i], { _killed: true }, "0x0000", 0]);
      }
    }
    this.setState({ deployedChains:deployedChains, loadingData: false });
  };

  logout= (event) =>{
    this.state.user.logout();
  };

  renderChains = () => {
    //chainDets is just the current object, id is the id of the current element
    let items = this.state.deployedChains.map((chainDets, id) => {
      if(!this.verifyContract(chainDets)){
        return;
      }
      let oldDate = parseInt(Date.parse(getTime(chainDets) +  this.state.timezone), 10);
      let newDate = parseInt(Date.now(),10);
      let difference = Math.abs(oldDate - newDate);

      let seconds = Math.floor(difference/1000) ;
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
            {(stage !== '11' &&
              <div>
                <Card.Description>Stage: {parseInt(stage, 10) + 1}/11 (<span style={{ "color": "red" }}>{stateLabel[stage][0]}</span>)</Card.Description><br />
                <Progress value={stage} total='10' indicating />
                <Link to={{
                  pathname: `/UI-project/${chainDets.id}`,
                  state: {
                    data:chainDets,
                    account:this.state.account,
                    token:this.state.apiKey,
                    users:this.state.allUsers
                  }
                }}>
                  <Button primary icon labelPosition="right" floated="right"><Icon name='right arrow' />Details</Button>
                </Link>
              </div>) ||
            <div>Stage: <span style={{ "color": "red" }}>Terminated</span></div>
            }

            {this.state.account === chainDets.contractProperties[2].value &&
              <Button loading={this.state.loading} disabled={this.state.loading} basic color='red' icon labelPosition="left" floated='right' onClick={() => this.deleteContract(chainDets[0])}><Icon name="warning sign" />Delete</Button>
            }
          </Card.Content>
        </Card>
      );
    });

    return <Card.Group>{items}</Card.Group>;
  };
  //
  handleClick = (event) => {
    const currentPage = Number(event.target.id);
    const indexOfLastChain = currentPage * this.state.chainsPerPage;
    const indexOfFirstChain = indexOfLastChain - this.state.chainsPerPage;

    this.getChains(indexOfFirstChain, indexOfLastChain);
    this.setState({ currentPage });
  };

  deleteContract = async (address) => {
    console.log("This feature is not applicable");
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ errorMessage: '', loading: true, msg: '' });

    console.log(this.state.freightCarrierAddress, this.state.description, this.state.originCustomsAddress,
                this.state.consigneeAddress);

    await api.createContract(this.state.apiKey, this.state.description, this.state.freightCarrierAddress,
                             this.state.originCustomsAddress, this.state.consigneeAddress);
    // try {
    //   let { description, freightCarrierAddress, originCustomsAddress, consigneeAddress, account } = this.state;
    //   await FactoryInstance.methods.createSupplyChain(description, freightCarrierAddress, originCustomsAddress, consigneeAddress).send({ from: account });
    //   this.setState({ msg: 'Contract deployed successfully!' });
    // } catch (err) {
    //   this.setState({ errorMessage: err.message });
    // }
    //
    this.setState({ loading: false });
  };

  setValues(values){
    console.log(values);
  };

  handleConsigneeChange=(e, selectedOption) => {
    this.setState({consigneeAddress:selectedOption.value});
  };

  handleFreightChange=(e, selectedOption) => {
    this.setState({ freightCarrierAddress:selectedOption.value});
  };

  handleCustomsChange=(e, selectedOption) => {
    this.setState({ originCustomsAddress:selectedOption.value});
  };


  render() {
    let last=this.state.chainsPerPage;
    let statusMessage="";
    let that = this;


    if (this.state.deployedChainsAddr.length < last) {
      last = this.state.deployedChainsAddr.length;
    }
    statusMessage=this.checkStatusMessage();


    const pageNumbers=[];
    for (let i = 1; i <= Math.ceil(this.state.deployedChainsAddr.length / this.state.chainsPerPage); i++) {
      pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => {
      return (
        <Button key={number} id={number} onClick={this.handleClick}>{number}</Button>
      );
    });

    return (
   <div>
    <h1>Deployed Supply Chain Transportation Contracts</h1>
    <Grid stackable reversed='mobile'>
      <Grid.Row>
        <Grid.Column width={12}>
          {(this.state.deployedChainsAddr.length > 0 && this.renderChains()) || <b>No contracts deployed!</b>}
        </Grid.Column>
        <Grid.Column width={4}>
          <Grid.Row>
            <Modal trigger={<Button primary icon labelPosition='right'><Icon name='plus circle' />Deploy New Supplychain</Button>}>
              <Modal.Header>Supplychain Transportation Factory</Modal.Header>
              <Modal.Content>
                <Form onSubmit={that.onSubmit} error={!!this.state.errorMessage}>
                  <Form.Field>
                    <label>Description</label>
                    <Input onChange={event => that.setState({ description: event.target.value })} />
                  </Form.Field>
                  <Form.Field>
                    <label>Freight Carrier Address</label>
                    <Dropdown
                      selection
                      value={this.state.freightCarrierAddress}
                      options={this.state.allUsers}
                      onChange={this.handleFreightChange}
                    />
                  </Form.Field>

                  <Form.Field>
                    <label>Origin Customs Address</label>
                    <Dropdown
                      selection
                      value={this.state.originCustomsAddress}
                      options={this.state.allUsers}
                      onChange={this.handleCustomsChange}
                    />
                  </Form.Field>

                  <Form.Field>
                    <label>Consignee Address</label>
                    <Dropdown
                      selection
                      value={this.state.consigneeAddress}
                      options={this.state.allUsers}
                      onChange={this.handleConsigneeChange}
                    />
                    {/*<Input  onChange={event => that.setState({ consigneeAddress: event.target.value })} />*/}
                  </Form.Field>
                  <Button loading={this.state.loading} disabled={this.state.loading} primary basic type='submit'>Deploy</Button>
                  <Message error header="Oops!" content={this.state.errorMessage} />
                  {statusMessage}
                </Form>
              </Modal.Content>
            </Modal>
          </Grid.Row>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row centered>
        <Button.Group>
          {renderPageNumbers}
        </Button.Group>
      </Grid.Row>
      <Grid.Row centered>
        <Button.Group>
          <Button  onClick={this.logout}>Logout</Button>
        </Button.Group>
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
      let statusMessage;
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


}

export default Factory;
