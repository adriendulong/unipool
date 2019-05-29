import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components'

import { useAppContext } from '../context/AppContext';
import { useLiquidInfos} from '../hooks'
import TokenElement from './TokenElement'
import Loader from './Loader'
import { TOKEN_ADDRESSES, TOKEN_SYMBOLS } from '../utils'

const HorizontalContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  margin: 0.5rem;
`

export default function TokenList({address}) {
  const [liquidInfosREP] = useLiquidInfos(TOKEN_ADDRESSES.REP, address)
  const [liquidInfosDAI] = useLiquidInfos(TOKEN_ADDRESSES.DAI, address)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if(liquidInfosREP.isReady) setIsLoading(false)
  }, [liquidInfosREP])

  return (
    <React.Fragment>
      {isLoading ? (
        <HorizontalContainer>
          <Loader/>
        </HorizontalContainer>
        
      ) : (
        <React.Fragment>
          <TokenElement tokenName="REP" liquidInfos={liquidInfosREP}/>
          
        </React.Fragment>
        
      )}
    </React.Fragment>
    
    
  );

}
//<TokenElement tokenName="DAI" liquidInfos={liquidInfosDAI}/>