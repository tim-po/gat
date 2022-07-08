import {BigNumber} from "ethers";

export const getBigNumber = (value) => {
  const MAX_BN = BigNumber.from("1000000000000000000");
  const price = BigNumber.from(value)
  return price.mul(MAX_BN)
}