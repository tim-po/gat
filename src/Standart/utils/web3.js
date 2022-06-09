import Web3 from 'web3';

const httpProvider = new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org')

const web3NoAccount = new Web3(httpProvider)

const getWeb3 = () => {
  return new Web3(httpProvider)
}

const getWeb3NoAccount = () => {
  return web3NoAccount
}

export const getContract = (abi, address) => {
  const web3 = getWeb3()
  return new web3.eth.Contract(abi, address)
}

export {getWeb3NoAccount}