import React, { Component } from "react";
import { Form, Input, Message, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";
import { Router } from '../routes';

class ContributeForm extends Component {
  state = {
    value: "",
    errorMessage: "",
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();

    // chamando a Campaign com o endereço do props feito no show.js
    const campaign = Campaign(this.props.address);

    this.setState({ loading: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether'),
      });
        // ReplaceRoute é uma função do next-routes que substitui a url atual pela url passada
        Router.replaceRoute(`/campaigns/${this.props.address}`)
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            label="ether"
            labelPosition="right"
            value={this.state.value}
            onChange={event => this.setState({ value: event.target.value })}
          />
        </Form.Field>

        <Message error header="Oops!" content={this.state.errorMessage}></Message>
        <Button loading={this.state.loading} primary>
          Contribute!
        </Button>
      </Form>
    );
  }
}

export default ContributeForm;
