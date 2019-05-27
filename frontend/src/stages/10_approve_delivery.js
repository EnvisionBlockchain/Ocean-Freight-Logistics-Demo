import React, { Component } from 'react';
import { Loader, Dimmer, Button, Message, Card } from 'semantic-ui-react';

class ApproveDelivery extends Component {
  state = {
    msg: '',
    errorMessage: '',
    loadingData: false,
    verified: false,
  }

  async componentDidMount() {
    this.setState({ loadingData: true });
    document.title = "Cargo Shipmemnt | Approve Delivery";
    this.setState({ loadingData: false });
  }

  approveDelivery = async () => {
    this.setState({ msg: '', loading: true, errorMessage: '' });
    try {
      await this.props.SupplyChainInstance.methods.ApproveDelivery().send({ from: this.props.account });
      this.setState({ msg: 'Delivery Approved!' });
    } catch (err) {
      this.setState({ errorMessage: err.messsage });
    }
    this.setState({ loading: false });
  }

  rejectDocuments = async () => {
    this.setState({ msg: '', loading: true, errorMessage: '' });
    try {
      await this.props.SupplyChainInstance.methods.Terminate().send({ from: this.props.account });
      this.setState({ msg: 'Delivery Rejected!' });
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

    let statusMessage;
    if (this.state.msg === '') {
      statusMessage = null;
    } else {
      statusMessage = <Message floating positive header={this.state.msg} />;
    }

    return (
      <div>
        <br /><br />
        <Card>
          <Card.Content>
            <Card.Description>
              <b>Approve Delivery?</b>
              <Button
                floated='right'
                color='green'
                loading={this.state.loading}
                disabled={this.state.loading}
                onClick={this.approveDelivery}>APPROVE</Button>
              <br /><br />
            </Card.Description>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <Card.Description>
              <b>Reject Delivery?</b>
              <Button
                floated='right'
                color='red'
                loading={this.state.loading}
                disabled={this.state.loading}
                onClick={this.rejectDocuments}>REJECT</Button>
              <br /><br />
            </Card.Description>
          </Card.Content>
        </Card>
        {statusMessage}
      </div>
    );
  }
}

export default ApproveDelivery;