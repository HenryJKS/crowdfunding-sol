// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract CampaignFactory {
    address payable[] public deployedCampaigns;

    // Creating an instance of the Campaign contract where we need to pass the constructor arguments
    /* We changed the Campaign constructor because we want whoever creates an instance to be the owner of a Campaign
       so we need to pass msg.sender as an argument, which will set the user's wallet as the manager */
    function createCampaign(uint minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(payable(newCampaign));
    }

    function getDeployedCampaigns() public view returns (address payable[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    /* Create a struct for Request, where it will be a class with attributes, and we will use this class so that
    the manager can send a certain amount of money to the supplier */
    struct Request {
        string description; // description of the reason for the transfer
        uint value; // amount to be transferred to the supplier
        address recipient; // supplier's address
        bool complete; // request status, if true the transfer has already been made
        uint approvalCount; // count of approved addresses
        mapping(address => bool) approvals; // mapping for addresses that want to approve
    }

    // Creating an array of Request
    Request[] public requests;
    address public manager;
    uint public minimumContribution;

    // Creating a mapping for addresses that want to approve
    mapping(address => bool) public approvers;

    // Counter of addresses that have approved
    uint public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    // Constructor defining the minimum contribution value and the manager's address
    constructor (uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string memory description, uint value, address recipient) public restricted {
        Request storage newRequest = requests.push(); 
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];
        // Only addresses that contributed can approve a request
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }   
    
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);

        payable(request.recipient).transfer(request.value);
        request.complete = true;
    }
    
    function getSummary() public view returns (
      uint balance, uint minContribution, uint lenRequests, uint countApprovers, address addressManager
      ) {
        return (
          balance = address(this).balance,
          minContribution = minimumContribution,
          lenRequests = requests.length,
          countApprovers = approversCount,
          addressManager = manager
        );
    }
    
    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}
