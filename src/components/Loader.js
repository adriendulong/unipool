import React from 'react';
import styled, { css, keyframes } from 'styled-components'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Rotate = styled.div`
  animation: ${rotate} 1s linear infinite;
  font-size: 2rem;
  width: 2rem;
`;



export default function Loader() {
  return (
    <Rotate>🎱</Rotate>
  )
}