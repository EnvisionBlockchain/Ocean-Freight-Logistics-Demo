import React, { Component } from 'react';
import { Loader, Dimmer, Form, Button, Input, Message, Modal, Progress } from 'semantic-ui-react';
import SparkMD5 from 'spark-md5';
import { azureDownload, azureUpload } from "../utils";
const { uploadBrowserDataToAzureFile, Aborter } = require("@azure/storage-file");

class BoardingShipment extends Component {
  state = {
    msg: '',
    errorMessage: '',
    loadingData: false,
    boardingDocs: '',
    boardingDocsHash: '',
    boardingDocsProgress: 0,
    shippingURL: '',
    shippingHash: '',
    laddingURL: '',
    laddingHash: '',
    verifyHash: '',
    verified: false,
  }

  async componentDidMount() {
    this.setState({ loadingData: true });
    document.title = "Azure UI";

    const shippingHash = await this.props.SupplyChainInstance.methods.ShippingDocuments().call({ from: this.props.account });
    const laddingHash = await this.props.SupplyChainInstance.methods.DraftBillOfLadingDocument().call({ from: this.props.account });
    this.setState({ shippingHash, laddingHash });

    this.downloadFileFromAzure('shippingDocs', shippingHash);
    this.downloadFileFromAzure('laddingDocs', laddingHash);

    this.setState({ loadingData: false });
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ errorMessage: '', loading: true, msg: '' });

    try {
      await this.props.SupplyChainInstance.methods.UploadFinalBillOfLading(this.state.boardingDocsHash).send({ from: this.props.account });
      await this.uploadFileToAzure(this.state.boardingDocs, this.state.boardingDocsHash);
      this.setState({ msg: 'Successfully uploaded!' });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  }

  downloadFileFromAzure = async (docType, fileName) => {
    this.setState({ loading: true });

    const url = azureDownload(fileName);

    if (docType === 'shippingDocs') {
      this.setState({ shippingURL: url });
    } else {
      this.setState({ laddingURL: url });
    }

    this.setState({ loading: false });
  }

  uploadFileToAzure = async (file, fileName) => {
    this.setState({ loading: true });
    const fileURL = await azureUpload(fileName);

    await uploadBrowserDataToAzureFile(Aborter.none, file, fileURL, {
      rangeSize: 4 * 1024 * 1024, // 4MB range size
      parallelism: 20, // 20 concurrency
      progress: ev => {
        let prgs = Math.round(ev.loadedBytes * 10000 / file.size) / 100;
        this.setState({ boardingDocsProgress: prgs });
      }
    });

    this.setState({ loading: false });
  }

  captureDocs = (file, docType) => {
    this.setState({ errorMessage: '', loading: true, msg: '' });

    if (typeof file !== 'undefined') {
      try {
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = async () => {
          const buffer = Buffer.from(reader.result);
          var spark = new SparkMD5.ArrayBuffer();
          spark.append(buffer);
          let hash = spark.end();
          if (docType === "verify") {
            this.setState({ verifyHash: hash, verified: true });
          } else {
            this.setState({ boardingDocsHash: hash.toString() });
          }
        }
      } catch (err) {
        console.log("error: ", err.message);
      }
    } else {
      this.setState({ errorMessage: 'No file selected!' });
    }
    this.setState({ loading: false });
  }

  amendDocuments = async () => {
    this.setState({ msg: '', loading: true, errorMessage: '' });
    try {
      await this.props.SupplyChainInstance.methods.AmendBillOfLading().send({ from: this.props.account });
      this.setState({ msg: 'Documents Amend Requested!' });
    } catch (err) {
      this.setState({ errorMessage: err.messsage });
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

    let verifyMsg = '';
    if (this.state.verifyHash === this.state.shippingHash || this.state.verifyHash === this.state.laddingHash) {
      verifyMsg = "File is successfully verified. Integrity check successfully passed!";
    } else {
      verifyMsg = "Integrity check not passed or file is different:/";
    }

    let statusMessage;
    if (this.state.msg === '') {
      statusMessage = null;
    } else {
      statusMessage = <Message floating positive header={this.state.msg} />;
    }

    return (
      <div>
        <Modal size={'mini'} trigger={<Button basic color="blue">Amend Docs</Button>}>
          <Modal.Header>Send Documents Amend Request</Modal.Header>
          <Modal.Content>
            Amend Documents?
            <Button floated='right' loading={this.state.loading} primary basic onClick={this.amendDocuments}>Amend</Button>
            {statusMessage}
          </Modal.Content>
        </Modal>

        <Modal trigger={<Button basic color="red">Upload Docs</Button>}>
          <Modal.Header>Upload Shipping Docs</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
              <Form.Field>
                <label>Final Bill Of Lading Docs</label>
                <Input type='file' onChange={event => { this.setState({ boardingDocs: event.target.files[0] }); this.captureDocs(event.target.files[0], "boardingDocs") }} />
                {this.state.boardingDocsHash &&
                  <div>
                    File Hash: {this.state.boardingDocsHash} <br />
                    <Progress percent={this.state.boardingDocsProgress} indicating progress='percent' />
                  </div>
                }
              </Form.Field>
              <Button loading={this.state.loading} disabled={this.state.loading} primary basic type='submit'>Submit</Button>
              <Message error header="Oops!" content={this.state.errorMessage} />
              {statusMessage}
            </Form>
          </Modal.Content>
        </Modal>

        <br /><br />
        <Button.Group>
          <a href={this.state.shippingURL} download={this.state.shippingURL}><Button primary>Download Shipping Docs</Button></a>
          <Button.Or />
          <a href={this.state.laddingURL} download={this.state.laddingURL}><Button primary>Download Bill of Ladding</Button></a>
          <Button.Or />
          <Modal trigger={<Button primary>Verify Document</Button>}>
            <Modal.Header>Verify The Downloaded Documents</Modal.Header>
            <Modal.Content>
              <Form error={!!this.state.errorMessage}>
                <Form.Field>
                  <label>Choose either Shipping Docs or Bill of Ladding</label>
                  <Input type='file' onChange={event => { this.captureDocs(event.target.files[0], "verify") }} />
                  {this.state.verified && verifyMsg !== '' &&
                    <div>{verifyMsg}</div>
                  }
                </Form.Field>
                {/*<Button loading={this.state.loading} disabled={this.state.loading} primary basic type='submit'>Verify</Button>*/}
                <Message error header="Oops!" content={this.state.errorMessage} />
                {statusMessage}
              </Form>
            </Modal.Content>
          </Modal>
        </Button.Group>
      </div>
    );
  }
}

export default BoardingShipment;