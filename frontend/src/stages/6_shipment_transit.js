import React, { Component } from 'react';
import { Loader, Dimmer, Form, Button, Input, Message } from 'semantic-ui-react';

class ShipmentTransit extends Component {
  state = {
    msg: '',
    errorMessage: '',
    loadingData: false,
    drayageAgent: '',
  }

  async componentDidMount() {
    this.setState({ loadingData: true });
    document.title = "Cargo Shipmemnt | Shipment Transit";
    this.setState({ loadingData: false });
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ errorMessage: '', loading: true, msg: '' });

    try {
      await this.props.SupplyChainInstance.methods.SendBillOfLadingToCustoms(this.state.drayageAgent).send({ from: this.props.account });
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
    if (this.state.msg === '' && this.state.errorMessage === '') {
      statusMessage = null;
    } else {
      statusMessage = <Message floating positive header={this.state.msg} />;
    }

    return (
      <div>
        <br /><br />
        <h2>Pending Action: </h2>
        <h3>Add Drayage Agent Address</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <Input onChange={event => this.setState({ drayageAgent: event.target.value })} placeholder='Enter ETH Address' />
          </Form.Field><br />
          <Button loading={this.state.loading} disabled={this.state.loading} color='green' type='submit'>ADD</Button>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <br />{statusMessage}
        </Form>
      </div>
    );
  }
}

export default ShipmentTransit;