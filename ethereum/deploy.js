const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
  process.env.NEXT_PUBLIC_API_INFURA,
  process.env.NEXT_PUBLIC_MNEMONIC
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log("Attempting to deploy from account", accounts[0]);

    const result = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send({ gas: "1400000", from: accounts[0] }); 

    console.log("Contract deployed to", result.options.address);
    provider.engine.stop();
}


deploy();
