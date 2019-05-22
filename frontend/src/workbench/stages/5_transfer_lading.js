import React, { Component } from 'react';
import { Loader, Dimmer, Form, Button, Message } from 'semantic-ui-react';
import * as api from "../helpers/Api";
import Dropdown from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";

class TansferLading extends Component {
  state = {
    msg: '',
    errorMessage: '',
    loadingData: false,
    destinationCustomsBroker: '',
    destinationCustoms: '',
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
      await api.transfer_lading(this.props.token, this.props.id, this.state.destinationCustomsBroker,
                                 this.state.destinationCustoms);
      this.setState({ msg: 'Successfully Added!' });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };
  handleCustomsBrokerChange=(e, selectedOption) => {
    this.setState({destinationCustomsBroker:selectedOption.value});
  };

  handleDestinationCustomsChange=(e, selectedOption) => {
    this.setState({destinationCustoms:selectedOption.value});
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
    if (this.state.msg === '') {
      statusMessage = null;
    } else {
      statusMessage = <Message floating positive header={this.state.msg} />;
    }

    return (
      <div>
        <h3>Add Details</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Destination Customs Broker</label>
            <Dropdown
              selection
              value={this.state.consigneeAddress}
              options={this.props.users}
              onChange={this.handleCustomsBrokerChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Destination Customs</label>
            <Dropdown
              selection
              value={this.state.consigneeAddress}
              options={this.props.users}
              onChange={this.handleDestinationCustomsChange}
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

export default TansferLading;
