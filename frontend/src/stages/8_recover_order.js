import React, { Component } from 'react';
import { Loader, Dimmer, Form, Button, Input, Message, Modal, Progress } from 'semantic-ui-react';
import SparkMD5 from 'spark-md5';
import { azureDownload, azureUpload } from "../utils";

const { uploadBrowserDataToAzureFile, Aborter } = require("@azure/storage-file");

class RecoverOrder extends Component {
  state = {
    msg: '',
    errorMessage: '',
    loadingData: false,
    releaseOrderDocsURL: '',
    releaseOrderDocsHash: '',
    deliveryOrderDocs: '',
    deliveryOrderDocsHash: '',
    deliveryOrderDocsProgress: 0,
    verifyHash: '',
    verified: false,
  }

  async componentDidMount() {
    this.setState({ loadingData: true });
    document.title = "Azure UI";

    const releaseOrderDocsHash = await this.props.SupplyChainInstance.methods.ReleaseOrderDocument().call({ from: this.props.account });
    this.setState({ releaseOrderDocsHash });

    this.downloadFileFromAzure(releaseOrderDocsHash);

    this.setState({ loadingData: false });
  }

  downloadFileFromAzure = async (fileName) => {
    this.setState({ loading: true });

    const url = azureDownload(fileName);
    this.setState({ releaseOrderDocsURL: url });

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
        this.setState({ deliveryOrderDocsProgress: prgs });
      }
    });

    this.setState({ loading: false });
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ errorMessage: '', loading: true, msg: '' });

    try {
      await this.props.SupplyChainInstance.methods.SendDeliveryOrder(this.state.deliveryOrderDocsHash).send({ from: this.props.account });
      await this.uploadFileToAzure(this.state.deliveryOrderDocs, this.state.deliveryOrderDocsHash);

      this.setState({ msg: 'Successfully Added!' });
    } catch (err) {
      this.setState({ errorMessage: err.message });
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
            this.setState({ deliveryOrderDocsHash: hash.toString() });
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

  render() {
    if (this.state.loadingData) {
      return (
        <Dimmer active inverted>
          <Loader size='massive'>Loading...</Loader>
        </Dimmer>
      );
    }

    let verifyMsg = '';
    if (this.state.verifyHash === this.state.releaseOrderDocsHash) {
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
        <h3>Upload Delivery Order Document</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <Input type='file' onChange={event => { this.setState({ deliveryOrderDocs: event.target.files[0] }); this.captureDocs(event.target.files[0], "deliveryOrderDocs") }} />
            {this.state.deliveryOrderDocsHash &&
              <div>
                File Hash: {this.state.deliveryOrderDocsHash} <br />
                <Progress percent={this.state.deliveryOrderDocsProgress} indicating progress='percent' />
              </div>
            }
          </Form.Field>
          <Button loading={this.state.loading} disabled={this.state.loading} primary basic type='submit'>Upload</Button>
          <Message error header="Oops!" content={this.state.errorMessage} />
          {statusMessage}
        </Form>

        <br /><br />
        <Button.Group>
          <a href={this.state.releaseOrderDocsURL} download={this.state.releaseOrderDocsURL}><Button primary>Download Release Docs</Button></a>
          <Button.Or />

          <Modal trigger={<Button primary>Verify Document</Button>}>
            <Modal.Header>Verify The Downloaded Documents</Modal.Header>
            <Modal.Content>
              <Form error={!!this.state.errorMessage}>
                <Form.Field>
                  <label>Choose Release Oder Docs</label>
                  <Input type='file' onChange={event => { this.captureDocs(event.target.files[0], "verify") }} />
                  {this.state.verified && verifyMsg !== '' &&
                    <div>{verifyMsg}</div>
                  }
                </Form.Field>
                <Button loading={this.state.loading} disabled={this.state.loading} primary basic type='submit'>Verify</Button>
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

export default RecoverOrder;