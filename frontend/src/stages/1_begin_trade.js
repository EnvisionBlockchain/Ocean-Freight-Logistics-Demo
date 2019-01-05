import React, { Component } from 'react';
import {Loader, Dimmer, Form, Button, Input, Message, Modal} from 'semantic-ui-react';
import SparkMD5 from 'spark-md5';
import config from "../config";

const {
  AnonymousCredential,
  uploadBrowserDataToAzureFile,
  Aborter,
  FileURL,
  DirectoryURL,
  ShareURL,
  ServiceURL,
  StorageURL
} = require("@azure/storage-file");

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
    cfDocsProgress:0,
    cDocsProgress:0
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
      await this.props.SupplyChainInstance.methods.ExportClearance(this.state.seller,this.state.pod, this.state.bank, this.state.cfDocsHash, this.state.cDocsHash).send({from:this.props.account});
      this.uploadFileToAzure(this.state.cfDocs, 'cfDocs');
      this.uploadFileToAzure(this.state.cDocs, 'cDocs');
      this.setState({msg:'Successfully uploaded!'});
    }catch(err){
      this.setState({errorMessage:err.message});
    }

    this.setState({loading:false});
  }

  uploadFileToAzure = async (file, docType) => {
    this.setState({loading:true});

    const account = "uploadcustomsfiles";
    //const accountSas = "?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-04-05T12:16:51Z&st=2019-01-03T04:16:51Z&spr=https&sig=evHty2n7TtrLLpQWy4uQP%2FMlcHJIgmAG8y0AJOwwtTY%3D";
    const accountSas = config.accountSAS;

    const pipeline = StorageURL.newPipeline(new AnonymousCredential(), {
      retryOptions: { maxTries: 4 }, // Retry options
      telemetry: { value: "HighLevelSample V1.0.0" } // Customized telemetry string
    });
  
    const serviceURL = new ServiceURL(`https://${account}.file.core.windows.net${accountSas}`,pipeline);

    const shareName = "uploadfileshare";
    const shareURL = ShareURL.fromServiceURL(serviceURL, shareName);
    
    // Create a directory
    const directoryName = "uploadfiledir";
    const directoryURL = DirectoryURL.fromShareURL(shareURL, directoryName);

    // Create a blob
    let fileName;
    if (docType === 'cfDocs'){
      fileName = this.state.cfDocsHash;
    }else{
      fileName = this.state.cDocsHash;
    }
    const fileURL = FileURL.fromDirectoryURL(directoryURL, fileName);

    await uploadBrowserDataToAzureFile(Aborter.none, file, fileURL, {
      rangeSize: 4 * 1024 * 1024, // 4MB range size
      parallelism: 20, // 20 concurrency
      progress: ev => {
        let prgs = Math.round(ev.loadedBytes * 10000/file.size)/100;
        if (docType === 'cfDocs'){
          this.setState({cfDocsProgress: prgs});
        }else{
          this.setState({cDocsProgress: prgs});
        }
      }
    });

    this.setState({loading:false});
  }
  
  captureDocs = (file, docType) => {
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
          if (docType === 'cfDocs'){
            this.setState({cfDocsHash:hash.toString()});
          }else{
            this.setState({cDocsHash:hash.toString()});
          }
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
                <Input type='file' onChange={event => {this.setState({cfDocs:event.target.files[0]}); this.captureDocs(event.target.files[0], 'cfDocs')}} />
                {this.state.cfDocsHash &&
                  <div>
                    File Hash: {this.state.cfDocsHash} <br/>
                    Upload Progress: {this.state.cfDocsProgress}%  
                  </div>
                }
              </Form.Field>
              <Form.Field>
                <label>Customs Docs</label>
                <Input type='file' onChange={event => {this.setState({cDocs:event.target.files[0]}); this.captureDocs(event.target.files[0], 'cDocs')}} />
                {this.state.cDocsHash &&
                  <div>
                    File Hash: {this.state.cDocsHash} <br/>
                    Upload Progress: {this.state.cDocsProgress}%  
                </div>
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