import React, { Component } from 'react';
import {Loader, Dimmer, Form, Input, Message, Button, Card, Modal, Grid, Icon} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
//import {SupplyChainInstance} from '../ethereum/contractInstance';
import {FactoryInstance} from '../ethereum/factoryInstance';

class Factory extends Component {
  state = {
    msg:'',
    errorMessage:'',
    loadingData:false,
    account:'',
    description:'',
    freightCarrierAddress:'',
    originCustomsAddress:'',
    consigneeAddress:'',
    deployedChains:[],
  }

  async componentDidMount(){
    this.setState({loadingData:true});
    document.title = "Azure UI";

    const accounts = await web3.eth.getAccounts();
    let deployedChains = await FactoryInstance.methods.getDeployedSupplyChain().call({from:accounts[0]});
    this.setState({loadingData:false, account:accounts[0], deployedChains});
  }

  renderChains(){
    const items = this.state.deployedChains.map(chainID => {
      return {
        href:'/UI-project/'+chainID,
        header: "Address: " + chainID,
        description: "Click for Details",
        fluid: true,
        style: { overflowWrap: 'break-word' },
      };
    });

    return <Card.Group items={items} />;
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({errorMessage:'', loading:true, msg:''});

    try{
      let {description, freightCarrierAddress, originCustomsAddress, consigneeAddress, account} = this.state;
      let deployedAddress = await FactoryInstance.methods.createSupplyChain(description, freightCarrierAddress, originCustomsAddress, consigneeAddress).send({from:account});
      console.log(deployedAddress);
      this.setState({msg:'Contract deployed successfully!'});
    }catch(err){
      this.setState({errorMessage:err.message});
    }

    this.setState({loading:false});
  }

  render() {
    if(this.state.loadingData){
      return (
        <Dimmer active inverted>
        <Loader size='massive'>Loading...</Loader>
        </Dimmer>
        );
    }

    let statusMessage;
    if (this.state.msg === ''){
      statusMessage = null;
    }else{
      statusMessage = <Message floating positive header="Success!" content={this.state.msg} />;
    }

    return (
      <div>
      <h1>Deployed Supplychain Transportation Contracts</h1>
      <Grid stackable>
      <Grid.Column width={12}>
      {this.state.deployedChains.length>0 && this.renderChains()}
      {this.state.deployedChains.length===0 && <p>No contracts deployed!</p>}
      </Grid.Column>
      <Grid.Column width={4}>
      <Grid.Row>
      <Modal trigger={<Button primary icon labelPosition='right'><Icon name='plus circle' />Create New Contract</Button>}>
      <Modal.Header>Supplychain Transportation Factory</Modal.Header>
      <Modal.Content>
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
      <Form.Field>
      <label>Description</label>
      <Input onChange={event => this.setState({description:event.target.value})} />
      </Form.Field>
      <Form.Field>
      <label>Freight Carrier Address</label>
      <Input onChange={event => this.setState({freightCarrierAddress:event.target.value})} />
      </Form.Field>
      <Form.Field>
      <label>Oigin Customs Address</label>
      <Input onChange={event => this.setState({originCustomsAddress:event.target.value})} />
      </Form.Field>
      <Form.Field>
      <label>Consignee Address</label>
      <Input onChange={event => this.setState({consigneeAddress:event.target.value})} />
      </Form.Field>
      <Button loading={this.state.loading} primary basic type='submit'>Deploy</Button>
      <Message error header="Oops!" content={this.state.errorMessage} />
      {statusMessage}
      </Form>
      </Modal.Content>
      </Modal>
      </Grid.Row>
      </Grid.Column>
      </Grid>
      </div>
      );
  }
}

export default Factory;