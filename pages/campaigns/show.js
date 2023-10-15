import React, { Component } from "react";
import { Card, Grid, Button } from "semantic-ui-react";
import Layout from "../../components/Layout";
import ContributeForm from "../../components/ContributeForm";
import Campaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";
import { Link } from "../../routes";

class CampaignShow extends Component {
  // o metodo getInitialProps é chamado automaticamente antes do componente ser renderizado
  static async getInitialProps(props) {
    // props.query.address é o parametro passado na url
    // console.log(props.query.address);
    const campaign = Campaign(props.query.address);

    const summary = await campaign.methods.getSummary().call();

    return {
      // retornando o endereço do contrato
      address: props.query.address,
      minimumContribution: summary["minContribution"],
      balance: summary["balance"],
      requestsCount: summary["lenRequests"],
      approversCounts: summary["countApprovers"],
      manager: summary["addressManager"],
    };
  }

  renderCards() {
    const {
      balance,
      manager,
      minimumContribution,
      requestsCount,
      approversCounts,
    } = this.props;

    const items = [
      {
        header: manager,
        meta: "Addresss of Manager",
        description:
          "The manager create this campaign and can create requests to withdraw money",
        style: { overflowWrap: "break-word" },
      },

      {
        header: minimumContribution,
        meta: "Minimal Contribution (wei)",
        description:
          "You must contribute at least this much wei to become an approver",
      },

      {
        header: requestsCount,
        meta: "Number os Request",
        description:
          "Request try to withdraw money from the contract. Request must be approved by approvers",
      },

      {
        header: approversCounts,
        meta: "Number of Approvers",
        description:
          "Number of people who have already donated to this campaign",
      },

      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign Balance (eth)",
        description:
          "The balance is how much money this campaign has left to spend",
      },
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>

            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
            <Link route={`/campaigns/${this.props.address}/requests`}>
              <a>
                <Button primary>View Requests</Button>
              </a>
            </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
