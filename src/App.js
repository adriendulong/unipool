import React, { useEffect, useState } from 'react';
import { useWeb3Context } from 'web3-react'

import Main from './Main'

function App() {
  const context = useWeb3Context()
  

  useEffect(() => {
    context.setConnector('Network')
  }, [])

  useEffect(() => {
    console.log(context.error)
  }, [context.error])

  if (!context.active && !context.error) {
    return (<p>Loading</p>)
  } else if (context.error) {
    //error
    return (
      <p>{context.error}</p>
    )
  } else {
    // success
    return (
      <Main/>
    )
  }
}

export default App;
