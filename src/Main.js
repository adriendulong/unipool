import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import styled, { css } from 'styled-components'

import { useAppContext } from './context/AppContext';
import { TOKEN_ADDRESSES, TOKEN_SYMBOLS } from './utils'
import AddressContainer from './components/AddressContainer'
import TokenList from './components/TokenList'
import Loader from './components/Loader'

const ACCOUNT = '0xC009C7ae5f3e6dF9810a8244Ed9c9e3d35B789a3'

const AppWrapper = styled.div`
  width: 100vw;
  max-width: 560px;
  margin: 0px auto;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding-top: 5vh;
  overflow: scroll;
  @media only screen and (max-width: 480px) {
    padding-top: 0px;
  }
  @media only screen and (min-device-width: 768px) {
    max-height: 480px;
    overflow: hidden;
  }
`

const ColumnContainer = styled.div`
  display: flex;
  flex-flow: column wrap;
  width: 100%;
`

const HorizontalContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  margin: 0.5rem;
`

const Title = styled.h1`
  color: #F6B93B;
  font-size: 2.5em;
`

const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid palevioletred;
  color: palevioletred;
  margin: 0 1em;
  padding: 0.25em 1em;

  ${props =>
    props.primary &&
    css`
      background: palevioletred;
      color: white;
    `};
`

export default function Main() {
  //const [tokenUNIBalance, totalTokenUNIBalance, contractETHBalance, poolShare, userBalance, userTokenBalance, contractTokenBalance] = useLiquidInfos(TOKEN_ADDRESSES.REP, ACCOUNT)
  //const [logs] = useContractLogs(TOKEN_ADDRESSES.REP, ACCOUNT)

  const [address, setAddress] = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AppWrapper>
      <ColumnContainer>
        <HorizontalContainer>
          <Title>Unipool</Title>
        </HorizontalContainer>
        <AddressContainer/>
        {address && (
          <TokenList address={address}/>
        )}
        {isLoading && (
          <HorizontalContainer>
            <Loader/>
          </HorizontalContainer>
        )}
      </ColumnContainer>
    </AppWrapper>
  )
}

// {tokenUNIBalance ? (
//   <p>UNI Token balance: {tokenUNIBalance.toString()}</p>
// ) : (
//   <p> Waiting for your balance</p>
// )}
// {totalTokenUNIBalance && (
//   <p>Total Supply UNI TOKEN: {totalTokenUNIBalance.toString()}</p>
// )}
// {poolShare && (
//   <p>Your Shares: {poolShare.toString()}</p>
// )}
// {contractETHBalance && (
//   <p>Total Contract Balance: {ethers.utils.formatEther(contractETHBalance)} ETH</p>
// )}
// {userBalance && (
//   <p>Your ETH: {userBalance.toString()} ETH</p>
// )}
// {userTokenBalance && (
//   <p>User token balance: {ethers.utils.formatEther(userTokenBalance)} {TOKEN_SYMBOLS.REP} </p>
// )}
// {contractTokenBalance && (
//   <p>Contract token balance: {ethers.utils.formatEther(contractTokenBalance)} {TOKEN_SYMBOLS.REP} </p>
// )}