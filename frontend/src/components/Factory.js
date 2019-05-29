import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Loader, Dimmer, Form, Input, Message, Button, Card, Modal, Grid, Icon, Progress } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import { FactoryInstance } from '../ethereum/factoryInstance';
import { SupplyChainInstance as supplychain_instance } from '../ethereum/contractInstance';
import { stateLabel, calDateTime } from "../utils";

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
  }

  async componentDidMount() {
    this.setState({ loadingData: true });
    document.title = "Cargo Shipmemnt";

    const accounts = await web3.eth.getAccounts();
    let deployedChainsAddr = await FactoryInstance.methods.getDeployedSupplyChain().call({ from: accounts[0] });
    deployedChainsAddr = deployedChainsAddr.reverse()

    let last = this.state.chainsPerPage;
    if (deployedChainsAddr.length < last) {
      last = deployedChainsAddr.length;
    }

    let deployedChains = [];
    for (var i = 0; i < last; i++) {
      try {
        const SupplyChainInstance = await supplychain_instance(deployedChainsAddr[i]);
        const InstanceShipper = await SupplyChainInstance.methods.InstanceShipper().call({ from: accounts[0] });
        let metaData = await SupplyChainInstance.methods.getMetaData().call({ from: accounts[0] });
        deployedChains.push([deployedChainsAddr[i], metaData, InstanceShipper, last - 1 - i]);
      } catch (e) {
        //deployedChains.push([deployedChainsAddr[i], { _killed: true }, "0x0000", 0]);
      }
    }

    this.setState({ loadingData: false, account: accounts[0], deployedChainsAddr, deployedChains });
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
        const SupplyChainInstance = await supplychain_instance(deployedChainsAddr[i]);
        const InstanceShipper = await SupplyChainInstance.methods.InstanceShipper().call({ from: account });
        let metaData = await SupplyChainInstance.methods.getMetaData().call({ from: account });
        deployedChains.push([deployedChainsAddr[i], metaData, InstanceShipper, last - 1 - i]);
      } catch (e) {
        //deployedChains.push([deployedChainsAddr[i], { _killed: true }, "0x0000", 0]);
      }
    }

    this.setState({ deployedChains, loadingData: false });
  }

  renderChains = () => {
    let items = this.state.deployedChains.filter(chainDets => chainDets[1] !== null && chainDets[2] !== null).map((chainDets, id) => {
      let dateTime = calDateTime(chainDets[1]._lastAction[0]);
      var seconds = parseInt(chainDets[1].timeSinceLastAction, 10);
      var days = Math.floor(seconds / (3600 * 24));
      seconds -= days * 3600 * 24;
      var hrs = Math.floor(seconds / 3600);
      seconds -= hrs * 3600;
      var mnts = Math.floor(seconds / 60);
      seconds -= mnts * 60;

      return (
        <Card key={id} fluid style={{ overflowWrap: 'break-word' }}>
          <Card.Content>
            <Card.Header>Address: {chainDets[0]}</Card.Header>
            <Card.Meta>Created on: <b>{dateTime[0]} {dateTime[1]}</b></Card.Meta>
            <Card.Meta>Last action: <b>{days} days {hrs} hrs {mnts} min {seconds} sec</b> ago</Card.Meta>
            <Card.Description>Description: {chainDets[1]._Description}</Card.Description>
            {(chainDets[1]._State !== '11' &&
              <div>
                <Card.Description>Stage: {parseInt(chainDets[1]._State, 10) + 1}/11 (<span style={{ "color": "red" }}>{stateLabel[chainDets[1]._State][0]}</span>)</Card.Description><br />
                <Progress value={chainDets[1]._State} total='10' indicating />
                <Link to={{
                  pathname: `/${chainDets[0]}`,
                  state: {
                    metaData: chainDets[1],
                    InstanceShipper: chainDets[2],
                    contractNo: chainDets[3]
                  }
                }}>
                  <Button primary icon labelPosition="right" floated="right"><Icon name='right arrow' />Details</Button>
                </Link>
              </div>) ||
              <div>Stage: <span style={{ "color": "red" }}>Terminated</span></div>
            }

            {this.state.account === chainDets[2] &&
              <Button loading={this.state.loading} disabled={this.state.loading} basic color='red' icon labelPosition="left" floated='right' onClick={() => this.deleteContract(chainDets[0])}><Icon name="warning sign" />Delete</Button>
            }
          </Card.Content>
        </Card>
      );
    });

    return <Card.Group>{items}</Card.Group>;
  }

  handleClick = (event) => {
    const currentPage = Number(event.target.id);
    const indexOfLastChain = currentPage * this.state.chainsPerPage;
    const indexOfFirstChain = indexOfLastChain - this.state.chainsPerPage;

    this.getChains(indexOfFirstChain, indexOfLastChain);
    this.setState({ currentPage });
  }

  deleteContract = async (address) => {
    this.setState({ loading: true });
    try {
      const SupplyChainInstance = await supplychain_instance(address);
      await SupplyChainInstance.methods.kill().send({ from: this.state.account });
    } catch (e) {
      this.setState({ errorMessage: e.message });
    }
    this.setState({ loading: false });
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ errorMessage: '', loading: true, msg: '' });

    try {
      let { description, freightCarrierAddress, originCustomsAddress, consigneeAddress, account } = this.state;
      await FactoryInstance.methods.createSupplyChain(description, freightCarrierAddress, originCustomsAddress, consigneeAddress).send({ from: account });
      this.setState({ msg: 'Contract deployed successfully!' });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  }

  render() {
    if (this.state.loadingData) {
      return (
        <Dimmer active inverted>
          <Loader size='massive'>Loading...</Loader>
        </Dimmer>
      );
    }

    let statusMessage;
    if (this.state.msg === '') {
      statusMessage = null;
    } else {
      statusMessage = <Message floating positive header={this.state.msg} />;
    }

    const pageNumbers = [];
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
        <h1>Deployed Supplychain Transportation Contracts</h1>
        <Grid stackable reversed='mobile'>
          <Grid.Column width={12}>
            {(this.state.deployedChainsAddr.length > 0 && this.renderChains()) || <b>No contracts deployed!</b>}
          </Grid.Column>
          <Grid.Column width={4}>
            <Grid.Row>
              <Modal trigger={<Button primary icon labelPosition='right'><Icon name='plus circle' />New Supply Chain</Button>}>
                <Modal.Header>Deploy New Supply Chain</Modal.Header>
                <Modal.Content>
                  <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                      <label>Description</label>
                      <Input onChange={event => this.setState({ description: event.target.value })} />
                    </Form.Field>
                    <Form.Field>
                      <label>Freight Carrier Address</label>
                      <Input onChange={event => this.setState({ freightCarrierAddress: event.target.value })} />
                    </Form.Field>
                    <Form.Field>
                      <label>Origin Customs Address</label>
                      <Input onChange={event => this.setState({ originCustomsAddress: event.target.value })} />
                    </Form.Field>
                    <Form.Field>
                      <label>Consignee Address</label>
                      <Input onChange={event => this.setState({ consigneeAddress: event.target.value })} />
                    </Form.Field>
                    <Button
                      loading={this.state.loading}
                      disabled={this.state.loading}
                      floated='right'
                      labelPosition='left'
                      icon='globe'
                      color='green'
                      type='submit'
                      content='DEPLOY' /><br /><br />
                    <Message error header="Oops!" content={this.state.errorMessage} />
                    {statusMessage}
                  </Form>
                </Modal.Content>
              </Modal>
            </Grid.Row>
          </Grid.Column>
        </Grid>
        <Grid>
          <Grid.Row centered>
            <Button.Group>
              {renderPageNumbers}
            </Button.Group>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Factory;