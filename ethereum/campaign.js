import web3 from './web3';
import Campaign from './build/Campaign.json';

const campaign = (address) => {
    // os parametros serve para criar uma instancia de um contrato
    return new web3.eth.Contract(Campaign.abi, address);
}

export default campaign;