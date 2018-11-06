import React, { Component } from 'react';
import {Loader, Dimmer, Form, Input, Button, Message} from 'semantic-ui-react';
//import {Link} from 'react-router-dom';
import web3 from '../ethereum/web3';
import ContractInstance from '../ethereum/contractInstance';

class HelloWorld extends Component {
    state = {
    loadingData:false,
    errorMessage:'',
    msg:'',
    msgVal:'',
    account:'',
    existingMsg:'',
  }

  async componentDidMount(){
    this.setState({loadingData:true});
    document.title = "Azure UI | HelloWorld";

    const accounts = await web3.eth.getAccounts();
    let res = await ContractInstance.methods.getMsg().call({from:accounts[0]});
    this.setState({loadingData:false, account:accounts[0], existingMsg:res});
  }

  onSubmit = async event => {
    event.preventDefault();

    this.setState({errorMessage:'', loading:true, msg:''});
    try{
      let res = await ContractInstance.methods.postMsg(this.state.msgVal).send({from:this.state.account});
      console.log(res);
      this.setState({msg:'Message pushed to Azure PoA blockchain!'});
    }catch(err){
      console.log(err);
      this.setState({errorMessage:err.message, msg:''});
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
        <h1>Hello World Contract!</h1>
        <h3>Existing message: {this.state.existingMsg}</h3>
         <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Group>
            <Form.Field width={12}>
              <label>Enter Message</label>
              <Input onChange={event => this.setState({msgVal:event.target.value})} />
            </Form.Field>
            <Button size='small' floated='right' primary basic loading={this.state.loading} disabled={this.state.loading}>
              Push
            </Button>
          </Form.Group>
          <Message error header="Oops!" content={this.state.errorMessage} />
          {statusMessage}
        </Form>
      </div>
    );
  }
}

export default HelloWorld;