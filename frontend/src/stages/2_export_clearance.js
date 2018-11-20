import React, { Component } from 'react';
import {Loader, Dimmer, Button, Message, Modal} from 'semantic-ui-react';
import SparkMD5 from 'spark-md5';
import {SupplyChainInstance} from '../ethereum/contractInstance';

class ExportClearanceAction extends Component {
  state = {
    msg:'',
    errorMessage:'',
    loadingData:false,
  }

  async componentDidMount(){
    this.setState({loadingData:true});
    document.title = "Azure UI";
    this.setState({loadingData:false});
  }

  approveDocuments = async () => {
    this.setState({msg:'',loading:true, errorMessage:''});
    try{
      await SupplyChainInstance.methods.ApproveExportDocumentation().send({from:this.props.account});
      this.setState({msg:'Documents Approved!'});
    }catch(err){
      this.setState({errorMessage:err.messsage});
    }
    this.setState({loading:false});
  }

  amendDocuments = async () => {
    this.setState({msg:'',loading:true, errorMessage:''});
    try{
      await SupplyChainInstance.methods.AmendExportDocumentation().send({from:this.props.account});
      this.setState({msg:'Documents Amed Requested!'});
    }catch(err){
      this.setState({errorMessage:err.messsage});
    }
    this.setState({loading:false});
  }

  rejectDocuments = async () => {
    this.setState({msg:'',loading:true, errorMessage:''});
    try{
      await SupplyChainInstance.methods.Terminate().send({from:this.props.account});
      this.setState({msg:'Documents Rejected!'});
    }catch(err){
      this.setState({errorMessage:err.messsage});
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
    }else if (this.state.msg){
      statusMessage = <Message floating positive header="Success!" content={this.state.msg} />;
    }else if (this.state.errorMessage){
      statusMessage = <Message floating negative header="Oops!" content={this.state.errorMessage} />;
    }

    return (
      <div>
        <b>Contract State:</b> Export Clearance<br/>
        <Modal size={'mini'} trigger={<Button primary>Approve Documentation</Button>}>
          <Modal.Header>Approve Documents</Modal.Header>
          <Modal.Content>
            Approve Documents?
            <Button floated='right' color='green' loading={this.state.loading} primary basic onClick={this.approveDocuments}>Approve</Button>
            {statusMessage}
          </Modal.Content>
        </Modal>

        <Modal size={'mini'} trigger={<Button primary>Amend Documentation</Button>}>
          <Modal.Header>Send Document Amend Request</Modal.Header>
          <Modal.Content>
            Amend Documents?
            <Button floated='right' color='yellow' loading={this.state.loading} primary basic onClick={this.amendDocuments}>Amend</Button>
            {statusMessage}
          </Modal.Content>
        </Modal>

        <Modal size={'mini'} trigger={<Button primary>Reject</Button>}>
          <Modal.Header>Reject Export Clearance</Modal.Header>
          <Modal.Content>
            Reject Documents?
            <Button floated='right' color='red' loading={this.state.loading} primary basic onClick={this.rejectDocuments}>Reject</Button>
            {statusMessage}
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default ExportClearanceAction;