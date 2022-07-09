/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import React, {useEffect, useRef, useState} from "react";
import StandardAppContainer from "./Standard/StandardAppContainer";
import {
  useAllocationMarketplaceContract,
  useAllocationPaymentReceiverContract, useNftContract,
} from "./hooks/useContract";
import {useBUSDContract} from './Standard/hooks/useCommonContracts'
import {useWeb3React} from "@web3-react/core";
import Spinner from './Standard/components/Spinner';
import styled from 'styled-components';
import ErrorMessage from "./components/ErrorMessage";
import axios from 'axios';
import './styles/StyleOverrides.scss'
import GATE_LOGO from './images/gate_logo.png'
import BigNumber from "bignumber.js";
import useValidatedState, {validationFuncs} from "./Standard/hooks/useValidatedState";
import SimpleLabelContainer from "./Standard/components/SimpleLabelContainer";
import SimpleInput from "./Standard/components/SimpleInput";
import {AllocationPaymentReceiverAddress} from "./config/constants/contract";
import './styles.scss'
import {wei2eth} from "./Standard/utils/common";

interface ButtonProps {
  background: string;
  textColor: string;
  marginTop?: number;
}

const Button = styled.button<ButtonProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 18px;
  color: ${p => p.textColor};
  background: ${p => p.background};
  outline: none;
  transition: background 0.3s ease;
  margin-top: ${p => p.marginTop}px;

  &:focus,
  &:active {
    outline: none;
  }
`;

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
  padding: 12px;
  width: 100%;
`

const AllocationCardsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 320px;
  background: rgba(255, 255, 255, 1);
  border-radius: 20px;
  overflow: hidden;
`

const Text = styled.span<{fontSize?: string, width?: string, marginBottom?: string}>`
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

type Tear = {
  startId: number,
  endId: number,
  maxAllocationAmount: BigNumber
}

const App = () => {

  const {account} = useWeb3React()
  const marketplaceContract = useAllocationMarketplaceContract()
  const allocationContract = useAllocationPaymentReceiverContract()
  const busdContract = useBUSDContract()
  const nftContract = useNftContract()
  const [[busd, setBusd], isBusdValid] = useValidatedState<{ data: string, isValid: boolean }>({data: '', isValid: false}, validationFuncs.controlled)
  const [userNfts, setUserNfts] = useState<string[]>([])
  const [userMaxTier, setUserMaxTier] = useState<number>(-1)


  const [nftCollection, setNftCollection] = useState([])
  const [nftLoading, setNftLoading] = useState(true)
  const [allocationPrice, setAllocationPrice] = useState<string>('')
  const [totalAllocationError, setTotalAllocationError] = useState(false)
  const [transactionLoading, setTransactionLoading] = useState(false)
  const [transactionError, setTransactionError] = useState(false)
  const [userBusd, setUserBusd] = useState<number>(0)
  const [successModal, setSuccessModal] = useState(false)
  const [nftTears, setNFTTears] = useState<Tear[]>([])

  const getUserBalance = async () => {
    if (account) {
      const balance = await busdContract.methods.balanceOf(account).call()
      setUserBusd(balance / Math.pow(10, 18))
    }
  }

  const getNFTTears = async () => {
    if (account) {
      const tears: Tear[] = []
      for (let i = 0; i < 5; i++) {
        const tear = await allocationContract.methods.NFTIntervals(i).call()
        tears.push(tear)
      }
      console.log(tears)
      setNFTTears(tears)
    }
  }

  const getUserNfts = async () => {
    if (account) {
      const balance = await nftContract.methods.balanceOf('0xbDB24aa420Cfe284C9fCA7dfe5D39EAFb55E8a53').call()
      const nfts: string[] = []
      for (let i = 0; i < nftTears[nftTears.length-1].endId+1; i++) {
        const owner = await nftContract.methods.ownerOf(i).call()
        if(owner === '0xbDB24aa420Cfe284C9fCA7dfe5D39EAFb55E8a53'){
          nfts.push(`${i}`)
        }
        if(nfts.length >= balance){
          let maxTear = -1
          nftTears.forEach((tear, index) => {
            if(tear.startId <= i){
              maxTear = index
            }
          })
          setUserMaxTier(maxTear)
          break
        }
      }
      setUserNfts(nfts)
    }
    setNftLoading(false)
  }

  const checkApprove = async ()  => {
    if (account) {
      const busdCountApproved = await busdContract.methods.allowance(account, AllocationPaymentReceiverAddress).call()
      const weiBusd = new BigNumber(busd.data)

      if (+busdCountApproved < +weiBusd) {
        const APPROVE_TRANS = new BigNumber("115792089237316195423570985008687907853269984665640564039457584007913129639935");
        await busdContract.methods.approve(AllocationPaymentReceiverAddress, APPROVE_TRANS).send({from: account})
      }

      return true
    }
  }

  const showSuccessTransaction = () => {
    setSuccessModal(true)
  }

  useEffect(() => {
    getUserBalance()
    getNFTTears()
  }, [account])

  useEffect(()=>{
    if(nftTears.length){
      getUserNfts()
    }
  }, [account, nftTears])

  useEffect(() => {
    const allocationSum = nftCollection.reduce((accumulator, object) => {
      // @ts-ignore
      return accumulator + object.price;
    }, 0);
    setAllocationPrice(`${allocationSum}`)
  }, [nftCollection.length])

  const sendTransaction = async () => {
    if (busd) {
      setTransactionLoading(true)
      const weiBusd = new BigNumber(busd.data)
      try {
        const approveRes = await checkApprove()
        if(approveRes) {
          allocationContract.methods.applyForAllocations(weiBusd, userMaxTier).send({from: account})
            .then((res: { status: any; }) => {
              if (res.status) {
                setBusd({data: "0", isValid: false})
                setTransactionLoading(false)
                showSuccessTransaction()
              }
            })
        }
      } catch (e) {
        setTransactionError(true)
      }
    }
  }

  const maxallocation = wei2eth(nftTears[userMaxTier]?.maxAllocationAmount.toString())

  return (
    <StandardAppContainer version={'1.0.1'} locales={['en']}>
      <AllocationContainer>
       <div>
         {transactionError ?
           <ErrorMessage text={'Ooops... Something get wrong, please reload page and try again'} type={'primary'}/>
           :
           <Wrapper>
             <Text fontSize={'24px'}>
               <Wrapper>
                 <img src={GATE_LOGO} alt="" className="mt-10"/>
                 <h1 className="text-center text-2xl font-extrabold text-white mt-10 mb-10">We are prooduly happy to announce collaboration with <a href="https://www.gate.io/" target="_blank">gate.io</a></h1>
               </Wrapper>
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
                     {userMaxTier !== -1 &&
                       <div style={{minWidth: 320, minHeight: 320}}>
                         <video playsInline className={'nft-video'} width={320} height={320} autoPlay loop muted>
                           <source src={`/Creatives/T${userMaxTier + 1}.mp4`} type="video/mp4" />
                         </video>
                       </div>
                     }
                   <CardWrapper>
                     <div style={{width: '100%', color: 'black', fontSize: '20px', marginBottom: 20}}>{`Max allocation: ${maxallocation}$`}</div>
                     <SimpleInput
                       isValid={isBusdValid}
                       id={'BUSD'}
                       errorTooltipText={`Max allocation is ${maxallocation}`}
                       inputProps={{
                         type: 'number',
                         value: busd.data,
                         min: 1,
                         step: 1,
                         max: +maxallocation
                       }}
                       defaultValue={`${maxallocation}`}
                       defaultValueButtonText={'Max'}
                       hasDefaultValueButton
                       onChangeRaw={(newValue)=> {
                         setBusd({data: newValue, isValid: newValue !== "" && +newValue <= +maxallocation})
                       }}

                     />
                     {transactionLoading ?
                       <Spinner />
                       :
                       <Wrapper>
                         <WarningText>
                           Warning! You can only buy allocation once, after payment your NFT will be burned
                         </WarningText>
                         <Button
                           marginTop={20}
                           type={"button"}
                           textColor={isBusdValid ? "#fff" : "rgba(0, 0, 0, 0.6)"}
                           background={isBusdValid ? "#33CC66" : "rgba(0, 0, 0, 0.2)"}
                           onClick={isBusdValid ? sendTransaction : ()=>{}}
                         >
                           Buy Allocation
                         </Button>
                       </Wrapper>
                     }
                   </CardWrapper>
                   {successModal && <SuccessModal>Transaction was successful</SuccessModal>}
                 </AllocationCardsWrapper>
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
