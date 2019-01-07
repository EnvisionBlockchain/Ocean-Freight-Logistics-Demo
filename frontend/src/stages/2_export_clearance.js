import React, { Component } from 'react';
import {Loader, Dimmer, Button, Message, Modal, Form, Input} from 'semantic-ui-react';
import {azureDownload} from "../utils";
import SparkMD5 from 'spark-md5';

class ExportClearanceAction extends Component {
  state = {
    msg:'',
    errorMessage:'',
    loadingData:false,
    cURL:'',
    cfURL:'',
    verifyHash:'',
    verified:false,
  }

  async componentDidMount(){
    this.setState({loadingData:true});
    document.title = "Azure UI";

    const cfDocsHash = await this.props.SupplyChainInstance.methods.ExportDocument().call({from:this.props.account});
    const cDocsHash = await this.props.SupplyChainInstance.methods.CustomsDocument().call({from:this.props.account});
    this.setState({cfDocsHash, cDocsHash});
    this.downloadFileFromAzure('cfDocs', cfDocsHash);
    this.downloadFileFromAzure('cDocs', cDocsHash);

    this.setState({loadingData:false});
  }

  captureDocs = (file) => {
    this.setState({errorMessage:'', loading:true, msg:''});

    if (typeof file !== 'undefined'){
      try{
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {          
          const buffer = Buffer.from(reader.result);
          var spark = new SparkMD5.ArrayBuffer();
          spark.append(buffer);
          let hash = spark.end();
          this.setState({verifyHash:hash.toString(), verified:true});
        }

      }catch(err){
        console.log("error: ",err.message);
      }
    }else{
      this.setState({errorMessage:'No file selected!'});
    }
    this.setState({loading:false});
  }

  downloadFileFromAzure = async (docType, fileName) => {
    this.setState({loading:true});

    const url = azureDownload(fileName);

    if (docType === 'cfDocs'){
      this.setState({cfURL:url});
    }else{
      this.setState({cURL: url});
    }

    this.setState({loading:false});
  }

  approveDocuments = async () => {
    this.setState({msg:'',loading:true, errorMessage:''});
    try{
      await this.props.SupplyChainInstance.methods.ApproveExportDocumentation().send({from:this.props.account});
      this.setState({msg:'Documents Approved!'});
    }catch(err){
      this.setState({errorMessage:err.messsage});
    }
    this.setState({loading:false});
  }

  amendDocuments = async () => {
    this.setState({msg:'',loading:true, errorMessage:''});
    try{
      await this.props.SupplyChainInstance.methods.AmendExportDocumentation().send({from:this.props.account});
      this.setState({msg:'Documents Amend Requested!'});
    }catch(err){
      this.setState({errorMessage:err.messsage});
    }
    this.setState({loading:false});
  }

  rejectDocuments = async () => {
    this.setState({msg:'',loading:true, errorMessage:''});
    try{
      await this.props.SupplyChainInstance.methods.Terminate().send({from:this.props.account});
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

    let verifyMsg ='';
    if (this.state.verifyHash===this.state.cfDocsHash || this.state.verifyHash===this.state.cDocsHash){
      verifyMsg = "File is successfully verified. Integrity check successfully passed!";
    }else{
      verifyMsg = "Integrity check not passed or file is different:/";
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

        <br/><br/>
        <a href={this.state.cfURL} download={this.state.cfURL}><Button primary>Download Export Docs</Button></a>
        <a href={this.state.cURL} download={this.state.cfURL}><Button primary>Download Customs Docs</Button></a>

        <br/><br/>

        <Modal trigger={<Button primary>Verify Document</Button>}>
          <Modal.Header>Verify The Downloaded Documents</Modal.Header>
          <Modal.Content>
            <Form error={!!this.state.errorMessage}>
              <Form.Field>
                <label>Choose either Customs or Exports Document</label>
                <Input type='file' onChange={event => {this.captureDocs(event.target.files[0])}} />
                {this.state.verified && verifyMsg!=='' &&
                  <div>{verifyMsg}</div>
                }
              </Form.Field>
              <Button loading={this.state.loading} disabled={this.state.loading} primary basic type='submit'>Verify</Button>
              <Message error header="Oops!" content={this.state.errorMessage} />
              {statusMessage}
            </Form>
          </Modal.Content>
        </Modal>

      </div>
    );
  }
}

export default ExportClearanceAction;