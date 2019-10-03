import React, { Component } from 'react';
import { Loader, Dimmer, Form, Button, Input, Message } from 'semantic-ui-react';

class TansferLading extends Component {
  state = {
    msg: '',
    errorMessage: '',
    loadingData: false,
    destinationCustomsBroker: '',
    destinationCustoms: '',
  }

  async componentDidMount() {
    this.setState({ loadingData: true });
    document.title = "Cargo Shipmemnt | Transfer Bill of Lading";
    this.setState({ loadingData: false });
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ errorMessage: '', loading: true, msg: '' });

    try {
      await this.props.SupplyChainInstance.methods.TransferBillOfLading(this.state.destinationCustomsBroker, this.state.destinationCustoms).send({ from: this.props.account });
      this.setState({ msg: 'Successfully Added!', errorMessage: '' });
    } catch (err) {
      this.setState({ errorMessage: err.message, msg: '' });
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

    let statusMessage;
    if (this.state.msg === '') {
      statusMessage = null;
    } else {
      statusMessage = <Message floating positive header={this.state.msg} />;
    }

    return (
      <div>
        <br /><br />
        <h2>Pending Action: </h2>
        <h3>Add Details</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Destination Customs Broker</label>
            <Input onChange={event => this.setState({ destinationCustomsBroker: event.target.value })} placeholder='Enter ETH Address' />
          </Form.Field>
          <Form.Field>
            <label>Destination Customs</label>
            <Input onChange={event => this.setState({ destinationCustoms: event.target.value })} placeholder='Enter ETH Address' />
          </Form.Field><br />
          <Button loading={this.state.loading} disabled={this.state.loading} color='green' type='submit'>ADD</Button>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <br />{statusMessage}
        </Form>
      </div>
    );
  }
}

export default TansferLading;