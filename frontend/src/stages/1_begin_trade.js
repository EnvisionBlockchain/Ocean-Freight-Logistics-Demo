import React, { Component } from 'react';
import {Loader, Dimmer, Form, Button, Input, Message, Modal} from 'semantic-ui-react';
import SparkMD5 from 'spark-md5';
import {SupplyChainInstance} from '../ethereum/contractInstance';

class SendForExportClearance extends Component {
  state = {
    msg:'',
    errorMessage:'',
    loadingData:false,
    seller:'',
    bank:'',
    pod:'',
    cfDocs:'',
    cDocs:'',
    cfDocsHash:'',
    cDocsHash:'',
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
      await SupplyChainInstance.methods.ExportClearance(this.state.seller,this.state.pod, this.state.bank, this.state.cfDocsHash, this.state.cDocsHash).send({from:this.props.account});
      this.setState({msg:'Successfully uploaded!'});
    }catch(err){
      this.setState({errorMessage:err.message});
    }

    this.setState({loading:false});
  }

  captureCFDocs = (file) => {
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
          this.setState({cfDocsHash:hash.toString()});
        }
      }catch(err){
        console.log("error: ",err.message);
      }
    }else{
      this.setState({errorMessage:'No file selected!'});
    }
    this.setState({loading:false});
  }

  captureCDocs = (file) => {
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
          this.setState({cDocsHash:hash.toString()});
        }
      }catch(err){
        console.log("error: ",err.message);
      }
    }else{
      this.setState({errorMessage:'No file selected!'});
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
      <b>Contract State:</b> Begin Trade<br/>
        <Modal trigger={<Button primary>Export Clearance</Button>}>
          <Modal.Header>Upload Export Clearance Docs</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
              <Form.Field>
                <label>Seller</label>
                <Input onChange={event => this.setState({seller:event.target.value})} placeholder='<string>' />
              </Form.Field>
              <Form.Field>
                <label>Port Of Discharge</label>
                <Input onChange={event => this.setState({pod:event.target.value})} />
              </Form.Field>
              <Form.Field>
                <label>Origin Bank</label>
                <Input onChange={event => this.setState({bank:event.target.value})} />
              </Form.Field>
              <Form.Field>
                <label>Customs Filing Docs</label>
                <Input type='file' onChange={event => {this.setState({cfDocs:event.target.files[0]}); this.captureCFDocs(event.target.files[0])}} />
                {this.state.cfDocsHash &&
                  <div>File Hash: {this.state.cfDocsHash}</div>
                }
              </Form.Field>
              <Form.Field>
                <label>Customs Docs</label>
                <Input type='file' onChange={event => {this.setState({cDocs:event.target.files[0]}); this.captureCDocs(event.target.files[0])}} />
                {this.state.cDocsHash &&
                  <div>File Hash: {this.state.cDocsHash}</div>
                }
              </Form.Field>
              <Button loading={this.state.loading} primary basic type='submit'>Submit</Button>
              <Message error header="Oops!" content={this.state.errorMessage} />
              {statusMessage}
            </Form>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default SendForExportClearance;