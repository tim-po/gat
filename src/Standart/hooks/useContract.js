import {useState, useEffect} from "react";
import useWeb3 from "./useWeb3";
import AllocationPaymentReciever from '../config/abi/AllocationPaymentReceiver.json';
import AllocationMarketplace from '../config/abi/AllocationMarketplace.json'
import Busd from '../config/abi/Busd.json'

const useContract = (abi, address) => {
  const web3 = useWeb3();
  const [contract, setContract] = useState(new web3.eth.Contract(abi, address));

  useEffect(() => {
    setContract(new web3.eth.Contract(abi, address));
  }, [abi, address, web3]);

  return contract;
}

export const useAllocationPaymentReceiverContract = (address) => {
  const abi = AllocationPaymentReciever
  return useContract(abi, address);
}

export const useAllocationMarketplaceContract = (address) => {
  const abi = AllocationMarketplace
  return useContract(abi, address);
}

export const useBusdContract = (address) => {
  const abi = Busd
  return useContract(abi, address)
}

