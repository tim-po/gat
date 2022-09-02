/* eslint-disable no-undef */
import {BigNumber} from "bignumber.js";

export const wei2eth = (val) => {
  if (val) {
    return (new BigNumber(val) / new BigNumber(10000000000000000000)) * new BigNumber(10);
  }
  return new BigNumber(0);
};
