import React, { Component } from 'react';
import { Loader, Dimmer, Button, Message, Card } from 'semantic-ui-react';
import * as api from "../helpers/Api";

class ApproveDelivery extends Component {
  state = {
    msg: '',
    errorMessage: '',
    loadingData: false,
    verified: false,
  };

  async componentDidMount() {
    this.setState({ loadingData: true });
    document.title = "Azure UI";
    this.setState({ loadingData: false });
  }

  approveDelivery = async () => {
    this.setState({ msg: '', loading: true, errorMessage: '' });
    try {
      await api.approve_delivery(this.props.token, this.props.id);
      this.setState({ msg: 'Delivery Approved!' });
    } catch (err) {
      this.setState({ errorMessage: err.messsage });
    }
    this.setState({ loading: false });
  };

  rejectDocuments = async () => {
    this.setState({ msg: '', loading: true, errorMessage: '' });
    try {
      await api.terminate(this.props.token, this.props.id);
      this.setState({ msg: 'Delivery Rejected!' });
    } catch (err) {
      this.setState({ errorMessage: err.messsage });
    }
    this.setState({ loading: false });
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
        <Card>
          <Card.Content>
            <Card.Description>
              <b>Approve Delivery?</b>
              <Button floated='right' color='green' loading={this.state.loading} primary basic onClick={this.approveDelivery}>Approve</Button>
              <br />
              {statusMessage}
            </Card.Description>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <Card.Description>
              <b>Reject Delivery?</b>
              <Button floated='right' color='red' loading={this.state.loading} primary basic onClick={this.rejectDocuments}>Reject</Button>
              <br />
              {statusMessage}
            </Card.Description>
          </Card.Content>
        </Card>
      </div>
    );
  }
}

export default ApproveDelivery;
