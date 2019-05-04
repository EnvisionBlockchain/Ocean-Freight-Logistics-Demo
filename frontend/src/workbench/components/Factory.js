/*
  This class/component is used to render the main page of the application and set links for
  each individual contract instance.

  Author: Steve Flynn
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Loader, Dimmer, Message, Button, Card, Grid, Icon, Progress, Modal, Form, Input } from 'semantic-ui-react';
import * as api from "../helpers/Api";
import { stateLabel } from "../helpers/utils";
import AdUser from "../helpers/users";

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
    timezone: '-04:00',
    user: null
  };

  componentDidMount() {
    this.setState({ loadingData: true });
    let that=this;
    let deployedChainsAddr=[];

    this.state.user = new AdUser();
    this.state.apiKey=this.state.user.getToken();
    if(this.state.apiKey === "ERROR"){console.log("Error in retrieving key");}


    api.run("GET", "/api/v2/contracts?workflowId=1", this.state.apiKey,
      function (err, _data) {
        if (!err) {
          //this.state.deployedChainsAddr = JSON.parse(_data).contracts;

          deployedChainsAddr=JSON.parse(_data).contracts;

          let last = that.state.chainsPerPage;
          if (deployedChainsAddr.length < last) {
            last = deployedChainsAddr.length;
          }

          let deployedChains=[];
          for (var i = 0; i < last; i++) {
            try {
              deployedChains.push(deployedChainsAddr[i]);
            } catch (e) {
              //deployedChains.push([deployedChainsAddr[i], { _killed: true }, "0x0000", 0]);
            }
          }
          that.setState({deployedChains:deployedChains, deployedChainsAddr:deployedChainsAddr});
          api.run("GET", "/api/v2/users/me", that.state.apiKey,
            function(err, _data2){
              if(!err && _data2){
                //console.log(JSON.parse(_data2).currentUser.emailAddress);
                //TODO:make sure userChainMappings will always be 0
                let account=JSON.parse(_data2).currentUser.userChainMappings[0].chainIdentifier;
                console.log(account);
                that.setState({ loadingData: false, account:account });
              }
            });
        } else {
          console.log(_data);
      }
      });
  }

  getTime(transaction){
    if(transaction.id == "24"){
      return Date.now();
    }

    let x=transaction.contractActions.length;
    return transaction.contractActions[x-1].timestamp;
}

getStage(transaction){
  //TODO:transaction list is pulling data that contains a transaction with ID:24
  //This is missing in the other app, figure this out
  if(transaction.id == "24"){
    return "11";
  }
  let x=transaction.contractProperties[0].value;
  return x;
}

getSeller(transaction){
  let x=transaction.contractProperties[9].value;
  return x;
}

  getDescription(transaction){
    if(transaction.id == "24"){
      return "UNKOWN";
    }
    let x=transaction.contractProperties[1].value;
    return x;
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
        // const SupplyChainInstance = await supplychain_instance(deployedChainsAddr[i]);
        // const InstanceShipper = await SupplyChainInstance.methods.InstanceShipper().call({ from: account });
        // let metaData = awa it SupplyChainInstance.methods.getMetaData().call({ from: account });
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
      let oldDate = parseInt(Date.parse(this.getTime(chainDets) +  this.state.timezone), 10);
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
      console.log(chainDets, stage);
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
                    lastAction:this.getTime(chainDets) +  this.state.timezone,
                    account:this.state.account
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
  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ errorMessage: '', loading: true, msg: '' });

    // try {
    //   let { description, freightCarrierAddress, originCustomsAddress, consigneeAddress, account } = this.state;
    //   await FactoryInstance.methods.createSupplyChain(description, freightCarrierAddress, originCustomsAddress, consigneeAddress).send({ from: account });
    //   this.setState({ msg: 'Contract deployed successfully!' });
    // } catch (err) {
    //   this.setState({ errorMessage: err.message });
    // }
    //
    // this.setState({ loading: false });
  };
  //
  render() {
    let last=this.state.chainsPerPage;
    let retVal="";
    let statusMessage="";
    let that = this;
    //TODO: separate the different versions of the app
    //TODO: possible extract auth context stuff into a function

    if (this.state.deployedChainsAddr.length < last) {
      last = this.state.deployedChainsAddr.length;
    }
    statusMessage=this.checkStatusMessage();


    //TODO: extract function
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
                    <Input onChange={event => that.setState({ freightCarrierAddress: event.target.value })} />
                  </Form.Field>
                  <Form.Field>
                    <label>Origin Customs Address</label>
                    <Input onChange={event => that.setState({ originCustomsAddress: event.target.value })} />
                  </Form.Field>
                  <Form.Field>
                    <label>Consignee Address</label>
                    <Input onChange={event => that.setState({ consigneeAddress: event.target.value })} />
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


}

export default Factory;
