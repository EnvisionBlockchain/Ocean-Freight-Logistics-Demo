import React, { Component } from 'react';
import {Loader, Dimmer, Form, Button, Input, Message, Modal} from 'semantic-ui-react';
import SparkMD5 from 'spark-md5';
import {azureUpload} from "../utils";
const {uploadBrowserDataToAzureFile, Aborter} = require("@azure/storage-file");

class BoardingShipment extends Component {
  state = {
    msg:'',
    errorMessage:'',
    loadingData:false,
    boardingDocs:'',
    boardingDocsHash:'',
    boardingDocsProgress:0,
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
      await this.props.SupplyChainInstance.methods.UploadFinalBillOfLading(this.state.boardingDocsHash).send({from:this.props.account});
      await this.uploadFileToAzure(this.state.boardingDocs, this.state.boardingDocsHash);
      this.setState({msg:'Successfully uploaded!'});
    }catch(err){
      this.setState({errorMessage:err.message});
    }

    this.setState({loading:false});
  }

  uploadFileToAzure = async (file, fileName) => {
    this.setState({loading:true});
    const fileURL = await azureUpload(fileName);
    
    await uploadBrowserDataToAzureFile(Aborter.none, file, fileURL, {
      rangeSize: 4 * 1024 * 1024, // 4MB range size
      parallelism: 20, // 20 concurrency
      progress: ev => {
        let prgs = Math.round(ev.loadedBytes * 10000/file.size)/100;
        this.setState({boardingDocsProgress: prgs});
      }
    });

    this.setState({loading:false});
  }

  captureDocs = (file) => {
    this.setState({errorMessage:'', loading:true, msg:''});

    if (typeof file !== 'undefined'){
      try{
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = async () => {
          const buffer = Buffer.from(reader.result);
          var spark = new SparkMD5.ArrayBuffer();
          spark.append(buffer);
          let hash = spark.end();
          this.setState({boardingDocsHash:hash.toString()});
        }
      }catch(err){
        console.log("error: ",err.message);
      }
    }else{
      this.setState({errorMessage:'No file selected!'});
    }
    this.setState({loading:false});
  }

  amendDocuments = async () => {
    this.setState({msg:'',loading:true, errorMessage:''});
    try{
      await this.props.SupplyChainInstance.methods.AmendBillOfLading().send({from:this.props.account});
      this.setState({msg:'Documents Amend Requested!'});
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
    }else{
      statusMessage = <Message floating positive header="Success!" content={this.state.msg} />;
    }

    return (
      <div>
      <b>Contract State:</b> Shipment Boarding<br/>
        <Modal size={'mini'} trigger={<Button primary>Amend Docs</Button>}>
          <Modal.Header>Send Documents Amend Request</Modal.Header>
          <Modal.Content>
            Amend Documents?
            <Button floated='right' color='yellow' loading={this.state.loading} primary basic onClick={this.amendDocuments}>Amend</Button>
            {statusMessage}
          </Modal.Content>
        </Modal>

        <Modal trigger={<Button primary>Upload Docs</Button>}>
          <Modal.Header>Upload Shipping Docs</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
              <Form.Field>
                <label>Final Bill Of Lading Docs</label>
                <Input type='file' onChange={event => {this.setState({boardingDocs:event.target.files[0]}); this.captureDocs(event.target.files[0])}} />
                {this.state.boardingDocsHash &&
                  <div>
                    File Hash: {this.state.boardingDocsHash} <br/>
                    Upload Progress: {this.state.boardingDocsProgress}%  
                  </div>
                }
              </Form.Field>
              <Button loading={this.state.loading} disabled={this.state.loading} primary basic type='submit'>Submit</Button>
              <Message error header="Oops!" content={this.state.errorMessage} />
              {statusMessage}
            </Form>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default BoardingShipment;