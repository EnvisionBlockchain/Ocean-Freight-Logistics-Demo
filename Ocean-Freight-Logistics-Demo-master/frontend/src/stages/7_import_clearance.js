import React, { Component } from 'react';
import { Button, Dimmer, Form, Grid, Input, Loader, Message, Modal, Progress } from 'semantic-ui-react';
import SparkMD5 from 'spark-md5';
import { azureDownload, azureUpload } from "../utils";

const { uploadBrowserDataToAzureFile, Aborter } = require("@azure/storage-file");

class ImportClearance extends Component {
  state = {
    msg: '',
    errorMessage: '',
    loadingData: false,
    releaseOrderDocs: '',
    releaseOrderDocsHash: '',
    releaseOrderDocsProgress: 0,
    shippingURL: '',
    shippingHash: '',
    laddingURL: '',
    laddingHash: '',
    verifyHash: '',
    verified: false,
  }

  async componentDidMount() {
    this.setState({ loadingData: true });
    document.title = "Cargo Shipmemnt | Import Clearance";

    const shippingHash = await this.props.SupplyChainInstance.methods.ShippingDocuments().call({ from: this.props.account });
    const laddingHash = await this.props.SupplyChainInstance.methods.DraftBillOfLadingDocument().call({ from: this.props.account });
    this.setState({ shippingHash, laddingHash });

    this.downloadFileFromAzure('shippingDocs', shippingHash);
    this.downloadFileFromAzure('laddingDocs', laddingHash);

    this.setState({ loadingData: false });
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
        this.setState({ releaseOrderDocsProgress: prgs });
      }
    });

    this.setState({ loading: false });
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ errorMessage: '', loading: true, msg: '' });

    try {
      await this.props.SupplyChainInstance.methods.SendReleaseOrder(this.state.releaseOrderDocsHash).send({ from: this.props.account });
      await this.uploadFileToAzure(this.state.releaseOrderDocs, this.state.releaseOrderDocsHash);

      this.setState({ msg: 'Successfully Uploaded!', errorMessage: '' });
    } catch (err) {
      this.setState({ errorMessage: err.message, msg: '' });
    }

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
            this.setState({ releaseOrderDocsHash: hash.toString() });
          }
        }
      } catch (err) {
        console.log("error: ", err.message);
      }
    } else {
      this.setState({ errorMessage: 'No file selected!', msg: '' });
    }
    this.setState({ loading: false });
  }

  amendDocuments = async () => {
    this.setState({ msg: '', loading: true, errorMessage: '' });
    try {
      await this.props.SupplyChainInstance.methods.AmendImportDocuments().send({ from: this.props.account });
      this.setState({ msg: 'Documents Amend Requested!', errorMessage: '' });
    } catch (err) {
      this.setState({ errorMessage: err.messsage, msg: '' });
    }
    this.setState({ loading: false });
  }

  rejectDocuments = async () => {
    this.setState({ msg: '', loading: true, errorMessage: '' });
    try {
      await this.props.SupplyChainInstance.methods.Terminate().send({ from: this.props.account });
      this.setState({ msg: 'Documents Rejected!', errorMessage: '' });
    } catch (err) {
      this.setState({ errorMessage: err.messsage, msg: '' });
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
        <br /><br />

        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={8}>
              <iframe title='Shipping Docs' src={this.state.shippingURL + '&rsct=application%2Fpdf&embedded=true'} width="450px" height="600rm" />
            </Grid.Column>
            <Grid.Column width={8}>
              <iframe title='Ladding Docs' src={this.state.laddingURL + '&rsct=application%2Fpdf&embedded=true'} width="450px" height="600rm" />
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <br /><br />

        <Grid>
          <Grid.Row>
            <a target="_blank" href={this.state.shippingURL} download={this.state.shippingURL}><Button primary>Download Shipping Docs</Button></a>
            <a target="_blank" href={this.state.laddingURL} download={this.state.laddingURL}><Button primary>Download Bill of Ladding</Button></a>
          </Grid.Row>
        </Grid>

        <br /><br />

        <Modal trigger={<Button color='blue' basic>VERIFY</Button>}>
          <Modal.Header>Verify The Downloaded Documents</Modal.Header>
          <Modal.Content>
            <Form error={!!this.state.errorMessage}>
              <Form.Field>
                <label>Choose either Shipping Docs or Bill of Ladding to verify</label>
                <Input type='file' onChange={event => { this.captureDocs(event.target.files[0], "verify") }} />
                {this.state.verified && verifyMsg !== '' &&
                  <div><br />{verifyMsg}</div>
                }
              </Form.Field>
              <Message error header="Oops!" content={this.state.errorMessage} />
              {statusMessage}
            </Form>
          </Modal.Content>
        </Modal>

        <br /><br />

        <h3>Pending Action: </h3>
        <Button.Group basic>
          <Modal trigger={<Button basic color="green">UPLOAD</Button>}>
            <Modal.Header>Upload Release Order Document</Modal.Header>
            <Modal.Content>
              <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                  <Input type='file' onChange={event => { this.setState({ releaseOrderDocs: event.target.files[0] }); this.captureDocs(event.target.files[0], "releaseOrderDocs") }} />
                  {this.state.releaseOrderDocsHash &&
                    <div>
                      File Hash: {this.state.releaseOrderDocsHash} <br />
                      <Progress percent={this.state.releaseOrderDocsProgress} indicating progress='percent' />
                    </div>
                  }
                </Form.Field>
                <Button
                  loading={this.state.loading}
                  disabled={this.state.loading}
                  color='green'
                  floated='right'
                  labelPosition='right'
                  icon='cloud upload'
                  type='submit'
                  content='UPLOAD' />
                <Message error header="Oops!" content={this.state.errorMessage} />
                <br /><br />{statusMessage}
              </Form>
            </Modal.Content>
          </Modal>

          <Modal size={'mini'} trigger={<Button basic color="yellow">AMEND</Button>}>
            <Modal.Header>Send Document Amend Request</Modal.Header>
            <Modal.Content>
              Amend Documents?
            <Button
                floated='right'
                color='yellow'
                loading={this.state.loading}
                disabled={this.state.loading}
                onClick={this.amendDocuments}>AMEND</Button>
              <br /><br />{statusMessage}
            </Modal.Content>
          </Modal>

          <Modal size={'mini'} trigger={<Button basic color="red">REJECT</Button>}>
            <Modal.Header>Reject Export Clearance</Modal.Header>
            <Modal.Content>
              Reject Documents?
            <Button
                floated='right'
                color='red'
                loading={this.state.loading}
                disabled={this.state.loading}
                onClick={this.rejectDocuments}>REJECT</Button>
              <br /><br />{statusMessage}
            </Modal.Content>
          </Modal>
        </Button.Group>
      </div>
    );
  }
}

export default ImportClearance;