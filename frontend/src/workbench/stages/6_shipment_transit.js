import React, { Component } from 'react';
import { Loader, Dimmer, Form, Button, Message } from 'semantic-ui-react';
import * as api from "../helpers/Api";
import Dropdown from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";

class ShipmentTransit extends Component {
  state = {
    msg: '',
    errorMessage: '',
    loadingData: false,
    drayageAgent: '',
  };

  async componentDidMount() {
    this.setState({ loadingData: true });
    document.title = "Azure UI";
    this.setState({ loadingData: false });
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ errorMessage: '', loading: true, msg: '' });

    try {
      await api.shipment_transit(this.props.token, this.props.id, this.state.drayageAgent);
      this.setState({ msg: 'Successfully Added!' });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  handleDrayageAgentChange=(e, selectedOption) => {
    console.log(selectedOption.value);
    this.setState({drayageAgent:selectedOption.value});
  };

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
        <h3>Add Drayage Agent Address</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <Dropdown
              selection
              value={this.state.drayageAgent}
              options={this.props.users}
              onChange={this.handleDrayageAgentChange}
            />
          </Form.Field>
          <Button loading={this.state.loading} disabled={this.state.loading} primary basic type='submit'>Add</Button>
          <Message error header="Oops!" content={this.state.errorMessage} />
          {statusMessage}
        </Form>
      </div>
    );
  }
}

export default ShipmentTransit;
