/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import React, {useEffect, useRef, useState} from "react";
import StandardAppContainer from "./Standart/StandardAppContainer";
import {
  useAllocationMarketplaceContract,
  useAllocationPaymentReceiverContract,
  useBusdContract
} from "./Standart/hooks/useContract";
import {AllocationMarketplaceAddress, AllocationPaymentReceiverAddress, BusdAddress} from './Standart/config/constants/contract';
import {useWeb3React} from "@web3-react/core";
import Spinner from './Standart/components/Spinner';
import styled from 'styled-components';
import Button from './Standart/components/Button';
import ErrorMessage from "./Standart/components/ErrorMessage";
import {useInput} from "./Standart/hooks/useInput";
import {BigNumber} from "ethers";
import {getBigNumber} from "./Standart/config/constants/BigNumber";
import axios from 'axios';
import GATE_LOGO from './Standart/images/gate_logo.png'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.5);
  padding: 30px;
  border-radius: 20px;
  width: 100%;
`

const AllocationCardsWrapper = styled.div`
  display: flex;
  flex-direction: column
`

const Text = styled.span`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: ${props => props.fontSize};
  width: ${props => props.width};
  margin-bottom: ${props => props.marginBottom};
  text-align: center;

  @media (max-width: 600px) {
    font-size: 14px;
  }
`

const WarningText = styled.div`
  color: red;
  font-weight: bold;
  width: 320px;
  font-size: 12px;
  text-align: center;
`

const SuccessModal = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background: #e5e5e51f;
  color: white;
  width: 380px;
  border-radius: 10px;
  margin-top: 20px;
`

const AllocationContainer = styled.div`

`

const SUCCESS_MODAL_TIMER = 5000;

const App = () => {

  const {account} = useWeb3React()
  const marketplaceContract = useAllocationMarketplaceContract(AllocationMarketplaceAddress)
  const allocationContract = useAllocationPaymentReceiverContract(AllocationPaymentReceiverAddress)
  const busdContract = useBusdContract(BusdAddress)
  const [nftCollection, setNftCollection] = useState([])
  const [nftLoading, setNftLoading] = useState(false)
  const [allocationPrice, setAllocationPrice] = useState('')
  const email = useInput('', {isEmpty: true, isEmail: true})
  const busd = useInput(allocationPrice, {isEmpty: true})
  const [totalAllocationError, setTotalAllocationError] = useState(false)
  const [transactionLoading, setTransactionLoading] = useState(false)
  const [transactionError, setTransactionError] = useState(false)
  const [userBusd, setUserBusd] = useState(null)
  const [successModal, setSuccessModal] = useState(false)
  const successModalTimer = useRef(undefined)

  const showNftCollection = async () => {
    setNftLoading(true)
    try {
      if (account) {
        for (let i = 0; i <= 4; i++) {
          const availableNft = await marketplaceContract.methods.balanceOf(account, i).call()
          const nftPrice = await allocationContract.methods.allocations(i).call()
          if (+availableNft) {
            setNftCollection(prevState => [...prevState, {name: `TIER-${i + 1}`, price: +nftPrice / Math.pow(10, 18)}])
          }
        }
        setNftLoading(false)
      }
    } catch (e) {
      setTransactionError(true)
    }
  }

  const getUserBalance = async () => {
    if (account) {
      const balance = await busdContract.methods.balanceOf(account).call()
      setUserBusd(balance / Math.pow(10, 18))
    }
  }

  const checkApprove = async ()  => {
    if (account) {
      const busdCountApproved = await busdContract.methods.allowance(account, AllocationPaymentReceiverAddress).call()
      const isApprovedForAll = await marketplaceContract.methods.isApprovedForAll(account, AllocationPaymentReceiverAddress).call()
      const weiBusd = getBigNumber(busd.value)

      if (+busdCountApproved < +weiBusd) {
        const APPROVE_TRANS = BigNumber.from("115792089237316195423570985008687907853269984665640564039457584007913129639935");
        await busdContract.methods.approve(AllocationPaymentReceiverAddress, APPROVE_TRANS).send({from: account})
      }

      if (!isApprovedForAll) {
        await marketplaceContract.methods.setApprovalForAll(AllocationPaymentReceiverAddress, true).send({from: account})
      }

      return true
    }
  }

  const getEncryptedEmail = async (email) => {
    try {
      const res = await axios.post('https://encrypted-email-mmpro.herokuapp.com/encryptEmail', {
        email: email
      })
      return res.data.encryptedEmail
    } catch(e) {
      console.log(e)
    }
  }

  const showSuccessTransaction = () => {
    setSuccessModal(true)

    successModalTimer.current = setTimeout(() => {
      setSuccessModal(false);
    }, SUCCESS_MODAL_TIMER);
  }

  useEffect(() => {
    showNftCollection()
    getUserBalance()
  }, [account])

  useEffect(() => {
    const allocationSum = nftCollection.reduce((accumulator, object) => {
      return accumulator + object.price;
    }, 0);
    setAllocationPrice(allocationSum)
  }, [nftCollection.length])

  const sendTransaction = async () => {

    if (+busd.value <= +allocationPrice) {
      setTotalAllocationError(false)
    } else {
      setTotalAllocationError(true)

      return
    }

    if (email.value && !email.emailError && busd.value && !totalAllocationError) {
      setTransactionLoading(true)
      const weiBusd = getBigNumber(busd.value)
      try {
        const approveRes = await checkApprove()
        const encryptedEmail = await getEncryptedEmail(email.value)
        if(approveRes && encryptedEmail) {
          allocationContract.methods.applyForAllocations(encryptedEmail, weiBusd).send({from: account})
            .then((res) => {
              if (res.status) {
                email.clearValue()
                busd.clearValue()
                setTransactionLoading(false)
                showSuccessTransaction()
                showNftCollection()
              }
            })
        }
      } catch (e) {
        setTransactionError(true)
      }
    }
  }

  return (
    <StandardAppContainer>
      <AllocationContainer>
       <div>
         {transactionError ?
           <ErrorMessage text={'Ooops... Something get wrong, please reload page and try again'} type={'primary'}/>
           :
           <Wrapper>
             <Text fontSize={'24px'}>
               <Wrapper>
                 <img src={GATE_LOGO} alt="" className="mt-10"/>
                 <h1 className="text-center text-3xl font-extrabold text-white mt-10 mb-10">We are prooduly happy to announce collaboration with <a href="https://www.gate.io/" target="_blank">gate.io</a></h1>
               </Wrapper>
               <h3 className="text-center text-3xl text-white">Allocation</h3>
               {!nftCollection.length && <Text fontSize={'20px'} marginBottom={'20px'}>Connect your wallet & buy allocation</Text>}
               {nftCollection.length ?
                 <>
                   <Text fontSize={'24px'} marginBottom={'10px'}>Your balance: {userBusd?.toFixed(1)}$</Text>
                   <Text fontSize={'14px'} width={'42%'} marginBottom={'20px'}>
                     Please provide email that you are using for your personal account at Zima Bank.
                     If you don’t have an account yet, please register it following that Link:
                     <a href="https://remotebankingaccess.com/sign-up" target="_blank">https://remotebankingaccess.com/sign-up</a>
                   </Text>
                 </>
                 :
                 ''
               }
             </Text>
             {nftLoading ?
               <Spinner/>
               :
               <Wrapper>
                 <AllocationCardsWrapper>
                   <CardWrapper>
                     <Text>
                       <Text fontSize={'20px'}>
                         {/*You have {nftCollection.map(item => <span key={item.name}>{item.name} </span>)} nft*/}
                       </Text>
                       <Text fontSize={'20px'}>
                         {/*Your max allocation is {allocationPrice?.toFixed(1)}$*/}
                       </Text>
                     </Text>
                     <div className="col-span-2 sm:col-span-3 mb-5">
                       <label className="block text-sm font-medium text-white mb-2">Email</label>
                       <input
                         style={{width: 250}}
                         type="email"
                         value={email.value}
                         onChange={email.onChange}
                         onBlur={email.onBlur}
                         className="shadow-sm focus:ring-borderGreen focus:border-borderGreen block w-full sm:text-sm border-gray rounded-md h-10 text-mainBlue p-3"
                       />
                       {(email.isDirty && email.emailError) && <ErrorMessage text={'Invalid email'}/>}
                     </div>
                     <div className="col-span-2 sm:col-span-3 mb-6">
                       <label className="block text-sm font-medium text-white mb-2">BUSD</label>
                       <input
                         style={{width: 250}}
                         type="number"
                         value={busd.value}
                         onChange={busd.onChange}
                         onBlur={busd.onBlur}
                         min={1}
                         step={1}
                         max={allocationPrice}
                         className="shadow-sm focus:ring-borderGreen focus:border-borderGreen block w-full sm:text-sm border-gray rounded-md h-10 text-mainBlue p-3"
                       />
                       {(busd.isDirty && !busd.value) && <ErrorMessage text={'Field is required'}/>}
                       {(busd.isDirty && totalAllocationError) && <ErrorMessage text={`Max amount for allocation is ${allocationPrice}$`}/>}
                     </div>
                     {transactionLoading ?
                       <Spinner />
                       :
                       <Wrapper>
                         <WarningText>
                           Warning! You can only buy allocation once, after payment your NFT will be burned and you won’t be able to pay again. Please provide maximum amount of desired allocation that you plan to spend.
                         </WarningText>
                         <Button
                           bgColor="primary"
                           className="w-40 mt-5"
                           onClick={sendTransaction}
                         >
                           Buy allocation
                         </Button>
                       </Wrapper>
                     }
                   </CardWrapper>
                   {successModal && <SuccessModal>Transaction was successful</SuccessModal>}
                 </AllocationCardsWrapper>
                 {/*{nftCollection.length ?*/}
                 {/*  <AllocationCardsWrapper>*/}
                 {/*    <CardWrapper>*/}
                 {/*      <Text>*/}
                 {/*        <Text fontSize={'20px'}>*/}
                 {/*          You have {nftCollection.map(item => <span key={item.name}>{item.name} </span>)} nft*/}
                 {/*        </Text>*/}
                 {/*        <Text fontSize={'20px'}>*/}
                 {/*          Your max allocation is {allocationPrice?.toFixed(1)}$*/}
                 {/*        </Text>*/}
                 {/*      </Text>*/}
                 {/*      <div className="col-span-2 sm:col-span-3 mb-5">*/}
                 {/*        <label className="block text-sm font-medium text-white mb-2">Email</label>*/}
                 {/*        <input*/}
                 {/*          style={{width: 250}}*/}
                 {/*          type="email"*/}
                 {/*          value={email.value}*/}
                 {/*          onChange={email.onChange}*/}
                 {/*          onBlur={email.onBlur}*/}
                 {/*          className="shadow-sm focus:ring-borderGreen focus:border-borderGreen block w-full sm:text-sm border-gray rounded-md h-10 text-mainBlue p-3"*/}
                 {/*        />*/}
                 {/*        {(email.isDirty && email.emailError) && <ErrorMessage text={'Invalid email'}/>}*/}
                 {/*      </div>*/}
                 {/*      <div className="col-span-2 sm:col-span-3 mb-6">*/}
                 {/*        <label className="block text-sm font-medium text-white mb-2">BUSD</label>*/}
                 {/*        <input*/}
                 {/*          style={{width: 250}}*/}
                 {/*          type="number"*/}
                 {/*          value={busd.value}*/}
                 {/*          onChange={busd.onChange}*/}
                 {/*          onBlur={busd.onBlur}*/}
                 {/*          min={1}*/}
                 {/*          step={1}*/}
                 {/*          max={allocationPrice}*/}
                 {/*          className="shadow-sm focus:ring-borderGreen focus:border-borderGreen block w-full sm:text-sm border-gray rounded-md h-10 text-mainBlue p-3"*/}
                 {/*        />*/}
                 {/*        {(busd.isDirty && !busd.value) && <ErrorMessage text={'Field is required'}/>}*/}
                 {/*        {(busd.isDirty && totalAllocationError) && <ErrorMessage text={`Max amount for allocation is ${allocationPrice}$`}/>}*/}
                 {/*      </div>*/}
                 {/*      {transactionLoading ?*/}
                 {/*        <Spinner />*/}
                 {/*        :*/}
                 {/*        <Wrapper>*/}
                 {/*          <WarningText>*/}
                 {/*            Warning! You can only buy allocation once, after payment your NFT will be burned and you won’t be able to pay again. Please provide maximum amount of desired allocation that you plan to spend.*/}
                 {/*          </WarningText>*/}
                 {/*          <Button*/}
                 {/*            bgColor="primary"*/}
                 {/*            className="w-40 mt-5"*/}
                 {/*            onClick={sendTransaction}*/}
                 {/*          >*/}
                 {/*            Buy allocation*/}
                 {/*          </Button>*/}
                 {/*        </Wrapper>*/}
                 {/*      }*/}
                 {/*    </CardWrapper>*/}
                 {/*    {successModal && <SuccessModal>Transaction was successful</SuccessModal>}*/}
                 {/*  </AllocationCardsWrapper>*/}
                 {/*  :*/}
                 {/*  <Text fontSize={'24px'}>You don't have nft </Text>*/}
                 {/*}*/}
               </Wrapper>
             }
           </Wrapper>
         }
       </div>
      </AllocationContainer>
    </StandardAppContainer>
  );
};

export default App;
