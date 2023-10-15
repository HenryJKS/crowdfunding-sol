// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract CampaignFactory {
    address payable[] public deployedCampaigns;

        // Criando a instancia do Contrato Campaign onde precisamos passar de argumento os parametros do construtor
    /*  Mudamos o construtor da Campaign pois queremos que quem criar uma instância seja o dono de uma Campaign
        então precisamos passar para o argumento o msg.sender que definirá a carteira usuario como manager */
    function createCampaign(uint minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(payable(newCampaign));
    }

    function getDeployedCampaigns() public view returns (address payable[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    /* Criar uma estrutura para Request, onde vai ser uma classe com atributos, e vamos usar essa classe para que 
    o manager consiga enviar um certo dinheiro para o fornecedor*/
    struct Request {
        string description; // descrição do motivo da transferência
        uint value; // valor que será transferido para fornecedor
        address recipient; // endereço do fornecedor
        bool complete; // status do request, se true ja foi feita a transferência
        uint approvalCount; // contagem de endereços aprovados
        mapping(address => bool) approvals; // mapping para endereços que querem aprovar
    }

    // Criando um array de Request
    Request[] public requests;
    address public manager;
    uint public minimumContribution;

    // Criando um mapping para endereços que querem aprovar
    mapping(address => bool) public approvers;

    // Contador de endereços que aprovaram
    uint public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    // construtor definindo o valor mínimo de contribuição e o endereço do manager
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
        newRequest.value= value;
        newRequest.recipient= recipient;
        newRequest.complete= false;
        newRequest.approvalCount= 0;
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];
        // onde somente os endereços que contribuiram podem aprovar um request
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