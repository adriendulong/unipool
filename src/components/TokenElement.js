import React from 'react';
import styled, { css } from 'styled-components'
import { ethers } from 'ethers'

import { TOKEN_ADDRESSES, TOKEN_SYMBOLS, TOKEN_LOGOS } from '../utils'

const TokenContainer = styled.div`
  display: flex;
  flex-flow: column wrap;
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 1rem;
`

const TokenLine = styled.div`
  display: flex;
  flex-flow: row nowrap;
  background-color: #F9F9F9;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  height: 50px;
  width: 100%;
  justify-content: space-around;
  align-items: center;

  p {
    font-size: 1.2rem;
    line-height: 1.2rem;
    height: 1.2rem;
    color: #757575;
  }
`

const TokenNameContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  flex: 2 2 auto;
`

const LogoToken = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  margin: 0.4rem;
  margin-right: 1rem;
`

const FiguresContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-evenly;
  align-items: center;
  flex: 5 5 auto;
`

const LogsLine = styled.div`
  display: flex;
  flex-flow: column wrap;
  background-color: #F9F9F9;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  height: 19px;
  background-color: rgba(85, 53, 128, .2);
  justify-content: center;
  align-content: center;
`

const SeeLogsText = styled.p`
  color: rgba(85, 53, 128);
  font-weight: 500;
  margin: 0px;
  font-size: 0.7rem;
  line-height: 0.7rem;
  height: 0.7rem;
`

export default function TokenElement({tokenName, liquidInfos}) {

  console.log(TOKEN_SYMBOLS[tokenName]);
  if(liquidInfos.hasPool){
    console.log(liquidInfos);
    console.log(liquidInfos.poolShare.toString());
    console.log(liquidInfos.userETH.toString());
    console.log(liquidInfos.userToken.toString());
  }
  

  function transformPoolShare() {
    return (liquidInfos.poolShare.toNumber()/10000)
  }

  return (
    <TokenContainer>
      <TokenLine>
        <TokenNameContainer>
          <LogoToken src={TOKEN_LOGOS[tokenName]}/>
          <p>{tokenName}</p>
        </TokenNameContainer>
        <FiguresContainer>
          <p>{transformPoolShare()}%</p>
          <p>{ethers.utils.formatEther(liquidInfos.userETH).slice(0,5)}</p>
          <p>{ethers.utils.formatEther(liquidInfos.userToken).slice(0,5)}</p>
        </FiguresContainer>
      </TokenLine>
      <LogsLine>
        <SeeLogsText>See 1 transaction</SeeLogsText>
      </LogsLine>
    </TokenContainer>
  )
}