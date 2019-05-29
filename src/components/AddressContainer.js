import React from 'react';
import styled, { css } from 'styled-components'
import { ethers } from 'ethers'
import { useAppContext } from '../context/AppContext';

const AddressBlock = styled.div`
  display: flex;
  flex-flow: column wrap;
  background-color: #F9F9F9;
  height: 50px;
  border-radius: 16px;
  padding: 18px;
  justify-content: space-between;
  margin-bottom: 20px;
`

const TitleLine = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: start;
`

const AddressTitle = styled.p`
  margin: 0px;
  color: #A8A8A8;
  font-size: 1rem;
  line-height: 1rem;
`

const InputLine = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: start;
`

const InputAddress = styled.input`
  color: #757575;
  font-size: 1.2rem;
  background-color: #F9F9F9;
  border: none;
  flex-grow: 1;

  :focus {
    outline: none;
  }

  ::placeholder {
    color: #A8A8A8;
    opacity: 0.5;
  }
`


export default function AddressContainer() {
  const [address, setAddress] = useAppContext();

  function addressChange(e){
    console.log(e.target.value)
    try {
      const address = ethers.utils.getAddress(e.target.value);
      setAddress(address)
    }
    catch (e) {
      console.log("Invalid Address")
      console.log(e)
      return null
    }
  }

  return (
    <AddressBlock>
      <TitleLine>
        <AddressTitle>Address</AddressTitle>
      </TitleLine>
      <InputLine>
        <InputAddress onChange={addressChange} placeholder="0x03029492"/>
      </InputLine>
    </AddressBlock>
  )
}