import React, { Component } from 'react';
import {Loader, Dimmer, Form, Button, Input, Message, Modal} from 'semantic-ui-react';

class TansferLading extends Component {
  state = {
    msg:'',
    errorMessage:'',
    loadingData:false,
    destinationCustomsBroker:'',
    destinationCustoms:'',
  }

  async componentDidMount(){
    this.setState({loadingData:true});
    document.title = "Azure UI";
    this.setState({loadingData:false});
  }

  onSubmit = async (event) => {
    event.preventDefault();    
    this.setState({errorMessage:'', loading:true, msg:''});

    try{
      await this.props.SupplyChainInstance.methods.TransferBillOfLading(this.state.destinationCustomsBroker, this.state.destinationCustoms).send({from:this.props.account});
      this.setState({msg:'Successfully Added!'});
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
    if (this.state.msg === '' && this.state.errorMessage === ''){
      statusMessage = null;
    }else{
      statusMessage = <Message floating positive header="Success!" content={this.state.msg} />;
    }

    return (
      <div>
      <b>Contract State:</b> Transfer Bill Of Lading<br/>
        <Modal trigger={<Button primary>Add Details</Button>}>
          <Modal.Header>Add Destination Details</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
              <Form.Field>
                <label>Destination Customs Broker</label>
                <Input onChange={event => this.setState({destinationCustomsBroker:event.target.value})} placeholder='ETH Address <string>' />
              </Form.Field>
              <Form.Field>
                <label>Destination Customs</label>
                <Input onChange={event => this.setState({destinationCustoms:event.target.value})} placeholder='ETH Address <string>' />
              </Form.Field>
              <Button loading={this.state.loading} disabled={this.state.loading} primary basic type='submit'>Add</Button>
              <Message error header="Oops!" content={this.state.errorMessage} />
              {statusMessage}
            </Form>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default TansferLading;