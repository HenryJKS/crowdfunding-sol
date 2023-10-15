import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";
import factory from "../ethereum/factory";
import Layout from '../components/Layout';
import { Link } from '../routes';

class CampaignIndex extends Component {
    // define a static method called getInitialProps
    // static methods are functions that are defined as part of a class
    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();

        return { campaigns };
    }

    renderCampaigns() {
        const items = this.props.campaigns.map(address => {
            return {
                header: address,
                description: (
                    // acessando o link de endereco da campanha
                    <Link route={`/campaigns/${address}`}>
                <a>View Campaign</a>
                </Link>
                ),
                fluid: true
            };
        });

        return <Card.Group items={items} />;
    }

    renderButton() {
        return (
        <Link route="/campaigns/new">
            <a>
                <Button floated="right" content='Create Campaign' icon="add circle" primary/>
            </a>
        </Link>
        );
    }

    render() {
        return (
        <Layout>
            <div>
                <h3>Open Campaigns</h3>
                {this.renderButton()}
                {this.renderCampaigns()}
            </div>
        </Layout>
        );
    }
}

export default CampaignIndex;