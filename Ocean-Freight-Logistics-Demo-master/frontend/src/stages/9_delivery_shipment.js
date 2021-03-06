import React, { Component } from 'react';
import { Button, Card, Dimmer, Form, Grid, Input, Loader, Message, Modal } from 'semantic-ui-react';
import SparkMD5 from 'spark-md5';
import { azureDownload } from "../utils";

class DeliveryOrder extends Component {
  state = {
    msg: '',
    errorMessage: '',
    loadingData: false,
    deliveryOrderDocsURL: '',
    deliveryOrderDocsHash: '',
    verifyHash: '',
    verified: false,
  }

  async componentDidMount() {
    this.setState({ loadingData: true });
    document.title = "Cargo Shipmemnt | Shipment Delivery";

    const deliveryOrderDocsHash = await this.props.SupplyChainInstance.methods.DeliveryOrderDocument().call({ from: this.props.account });
    this.setState({ deliveryOrderDocsHash });

    this.downloadFileFromAzure(deliveryOrderDocsHash);

    this.setState({ loadingData: false });
  }

  downloadFileFromAzure = async (fileName) => {
    this.setState({ loading: true });

    const url = azureDownload(fileName);
    this.setState({ deliveryOrderDocsURL: url });

    this.setState({ loading: false });
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ errorMessage: '', loading: true, msg: '' });

    try {
      await this.props.SupplyChainInstance.methods.SendDeliveryOrderForConsigneeSignature().send({ from: this.props.account });

      this.setState({ msg: 'Successfully Sent For Delivery!' });
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

  sendDeliveryOrder = async () => {
    this.setState({ msg: '', loading: true, errorMessage: '' });
    try {
      await this.props.SupplyChainInstance.methods.SendDeliveryOrderForConsigneeSignature().send({ from: this.props.account });
      this.setState({ msg: 'Delivery Order Sent Consignee Signature!' });
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
    if (this.state.verifyHash === this.state.deliveryOrderDocsHash) {
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
        <br /> <br />

        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={8}>
              <iframe title='Release Docs' src={this.state.deliveryOrderDocsURL + '&rsct=application%2Fpdf&embedded=true'} width="450px" height="600rm" />
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <br /><br />

        <Grid>
          <Grid.Row>
            <a href={this.state.deliveryOrderDocsURL} download={this.state.deliveryOrderDocsURL}><Button primary>Download Delivery Docs</Button></a>
          </Grid.Row>
        </Grid>

        <br /><br />

        <Modal trigger={<Button primary basic>VERIFY</Button>}>
          <Modal.Header>Verify The Downloaded Documents</Modal.Header>
          <Modal.Content>
            <Form error={!!this.state.errorMessage}>
              <Form.Field>
                <label>Choose Release Oder Docs</label>
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

        <br /> <br />

        <h3>Pending Action: </h3>
        <Card fluid>
          <Card.Content>
            <Card.Description>
              <b>Send Delivery Order For Consignee Signature</b>
              <Button
                loading={this.state.loading}
                disabled={this.state.loading}
                floated="right"
                color='green'
                icon='chevron right'
                labelPosition='right'
                onClick={this.sendDeliveryOrder}
                content='SEND' />
              <br /><br />
              {statusMessage}
            </Card.Description>
          </Card.Content>
        </Card>
      </div >
    );
  }
}

export default DeliveryOrder;