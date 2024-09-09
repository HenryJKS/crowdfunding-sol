# Crowdfunding in Solidity

Crowdfunding developed in Solidity. It allows users to invest in promising projects and helps project creators raise funds in a decentralized and transparent manner.

## Recursos

- **Project Investment**: Users can invest a specific amount in a project they find promising. Each investment helps the project reach its funding goal.
- **Project Creation**: Users can create their own projects, set a funding goal, and provide details about the project.
- **Transparency**: All investments are recorded on the blockchain, providing complete transparency on how much funds a project has raised.
- **Security**: The smart contract is developed in Solidity, ensuring the security and robustness of the crowdfunding system.

## Contracts

The provided code is a decentralized crowdfunding contract system implemented in Solidity, allowing users to create and manage fundraising campaigns on the Ethereum blockchain. The system consists of two contracts: `CampaignFactory` and `Campaign`.

### Contract Breakdown
1. CampaignFactory Contract
- Purpose: The CampaignFactory contract is responsible for creating and managing instances of crowdfunding campaigns (Campaign contracts).
- Key Components:
  - deployedCampaigns: An array that stores the addresses of all deployed campaigns.
  - createCampaign(): This function allows users to create a new campaign by specifying a minimum contribution. The creator of the campaign becomes the manager. The newly created campaign's address is added to the deployedCampaigns array.
  - getDeployedCampaigns(): A public view function that returns all the deployed campaigns' addresses.

2. Campaign Contract
- Purpose: The Campaign contract defines how individual crowdfunding campaigns function, including contributions, creating requests to use funds, approving requests, and finalizing payments.
- Key Components:
  - Request Struct: Defines the structure for fund withdrawal requests made by the campaign manager. It includes:
  - description: Reason for the fund transfer.
  - value: The amount to be transferred to the recipient.
  - recipient: The address that will receive the funds.
  - complete: Boolean to check if the request has been completed.
  - approvalCount: The number of contributors who have approved the request.
  - approvals: A mapping of contributors who have approved the request.
- State Variables:
  - requests: An array of Request structs that stores all the requests made by the manager.
  - manager: The address of the campaign creator, who manages the campaign.
  - minimumContribution: The minimum amount of ETH required to become an approver.
  - approvers: A mapping of addresses that tracks which contributors are eligible to vote on fund requests.
  - approversCount: The number of contributors who have sent funds and are eligible to approve requests.
- Modifiers:
  - restricted: Restricts access to certain functions (e.g., creating requests and finalizing requests) to only the campaign manager.
