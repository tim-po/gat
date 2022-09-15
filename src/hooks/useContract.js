import {useContract, useWeb3} from "../Standard/hooks/useCommonContracts";
import AllocationPaymentReciever from '../config/abi/AllocationPaymentReceiver.json';
import NFTAbi from '../config/abi/NFTAbi.json'
import {AllocationPaymentReceiverAddress, NFTAddress} from "../config/constants/contract";

export const useAllocationPaymentReceiverContract = () => {
  const abi = AllocationPaymentReciever
  return useContract(abi, AllocationPaymentReceiverAddress);
}

export const useNftContract = () => {
  const abi = NFTAbi
  return useContract(abi, NFTAddress);
}
