import { useEffect, useState, useCallback, useMemo } from 'react'
import { useWeb3Context } from 'web3-react'
import { ethers } from 'ethers'

import EXCHANGE_ABI from '../utils/exchange.json'
import {
  isAddress,
  getTokenContract,
  getExchangeContract,
  getTokenExchangeAddressFromFactory,
  getEtherBalance,
  getTokenBalance,
  getTokenAllowance,
  TOKEN_ADDRESSES
} from '../utils'

export function useBlockEffect(functionToRun) {
  const { library } = useWeb3Context()

  useEffect(() => {
    if (library) {
      function wrappedEffect(blockNumber) {
        functionToRun(blockNumber)
      }
      library.on('block', wrappedEffect)
      return () => {
        library.removeListener('block', wrappedEffect)
      }
    }
  }, [library, functionToRun])
}

export function useTokenContract(tokenAddress, withSignerIfPossible = true) {
  const { library, account } = useWeb3Context()

  return useMemo(() => {
    try {
      return getTokenContract(tokenAddress, library, withSignerIfPossible ? account : undefined)
    } catch {
      return null
    }
  }, [account, library, tokenAddress, withSignerIfPossible])
}

export function useExchangeContract(tokenAddress, withSignerIfPossible) {
  const { library, account } = useWeb3Context()

  const [exchangeAddress, setExchangeAddress] = useState()
  useEffect(() => {
    if (isAddress(tokenAddress)) {
      let stale = false
      getTokenExchangeAddressFromFactory(tokenAddress, library).then(exchangeAddress => {
        if (!stale) {
          setExchangeAddress(exchangeAddress)
        }
      })
      return () => {
        stale = true
        setExchangeAddress()
      }
    }
  }, [library, tokenAddress])

  return useMemo(() => {
    try {
      return getExchangeContract(exchangeAddress, library, withSignerIfPossible ? account : undefined)
    } catch {
      return null
    }
  }, [exchangeAddress, library, withSignerIfPossible, account])
}

export function useAddressBalance(address, tokenAddress) {
  const { library } = useWeb3Context()

  const [balance, setBalance] = useState()

  const updateBalance = useCallback(() => {
    if (isAddress(address) && (tokenAddress === 'ETH' || isAddress(tokenAddress))) {
      let stale = false

      ;(tokenAddress === 'ETH' ? getEtherBalance(address, library) : getTokenBalance(tokenAddress, address, library))
        .then(value => {
          if (!stale) {
            setBalance(value)
          }
        })
        .catch(() => {
          if (!stale) {
            setBalance(null)
          }
        })
      return () => {
        stale = true
        setBalance()
      }
    }
  }, [address, library, tokenAddress])

  useEffect(() => {
    return updateBalance()
  }, [updateBalance])

  useBlockEffect(updateBalance)

  return balance
}

export function useExchangeReserves(tokenAddress) {
  const exchangeContract = useExchangeContract(tokenAddress)

  const reserveETH = useAddressBalance(exchangeContract && exchangeContract.address, TOKEN_ADDRESSES.ETH)
  const reserveToken = useAddressBalance(exchangeContract && exchangeContract.address, tokenAddress)

  return { reserveETH, reserveToken }
}

export function useAddressAllowance(address, tokenAddress, spenderAddress) {
  const { library } = useWeb3Context()

  const [allowance, setAllowance] = useState()

  const updateAllowance = useCallback(() => {
    if (isAddress(address) && isAddress(tokenAddress) && isAddress(spenderAddress)) {
      let stale = false

      getTokenAllowance(address, tokenAddress, spenderAddress, library)
        .then(allowance => {
          if (!stale) {
            setAllowance(allowance)
          }
        })
        .catch(() => {
          if (!stale) {
            setAllowance(null)
          }
        })

      return () => {
        stale = true
        setAllowance()
      }
    }
  }, [address, library, spenderAddress, tokenAddress])

  useEffect(() => {
    return updateAllowance()
  }, [updateAllowance])

  useBlockEffect(updateAllowance)

  return allowance
}

export function useExchangeAllowance(address, tokenAddress) {
  const exchangeContract = useExchangeContract(tokenAddress)

  return useAddressAllowance(address, tokenAddress, exchangeContract && exchangeContract.address)
}

// Custom hook to get all the infos we want about an exchange
export function useLiquidInfos(tokenAddress, userAddress) {
  const exchange = useExchangeContract(tokenAddress, false)
  const tokenContract = useTokenContract(tokenAddress, false)

  const [tokenUNIBalance, setTokenUNIBalance] = useState()
  const [totalTokenUNIBalance, setTotalTokenUNIBalance] = useState()
  const [contractETHBalance, setContractETHBalance] = useState()
  const [poolShare, setPoolShare] = useState()
  const [userBalance, setUserBalance] = useState()
  const [userTokenBalance, setUserTokenBalance] = useState()
  const [contractTokenBalance, setContractTokenBalance] = useState()
  const [isReady, setIsReady] = useState(false);
  const [hasPool, setHasPool] = useState();

  useEffect(() => {
    if(exchange) {
      getBalance()
      //listenLogs()
    }
  }, [exchange])

  useEffect(() => {
    if(hasPool) {
      getTotalSupply()
      getContractBalance()
    }
    else if (hasPool === false){
      setIsReady(true)
    }
  }, [hasPool])

  useEffect(() => {
    if (exchange && tokenContract && poolShare) getTokenBalances()
  }, [exchange, tokenContract, poolShare])

  async function getBalance() {
    const balance = await exchange.balanceOf(userAddress);
    if(balance.eq(ethers.utils.bigNumberify(0))) setHasPool(false)
    else setHasPool(true)
    setTokenUNIBalance(balance);
  }

  async function getTotalSupply() {
    const supply = await exchange.totalSupply()
    setTotalTokenUNIBalance(supply)
  }

  async function getContractBalance() {
    const contractBalance = await ethers.getDefaultProvider().getBalance(exchange.address)
    setContractETHBalance(contractBalance)
  }

  async function getTokenBalances() {
    const contractTokenBalance = await tokenContract.balanceOf(exchange.address)
    setContractTokenBalance(contractTokenBalance)
    const userTokenBalance = contractTokenBalance.mul(poolShare).div(ethers.utils.bigNumberify(1000000))
    console.log("USER TOKEN BALANCE", userTokenBalance.toString())
    setUserTokenBalance(userTokenBalance)
  }

  useEffect(() => {
    if (totalTokenUNIBalance && tokenUNIBalance && contractETHBalance) {
      let poolShare = tokenUNIBalance.mul(ethers.utils.bigNumberify(1000000)).div(totalTokenUNIBalance)
      setPoolShare(poolShare)
      let myEth = contractETHBalance.mul(tokenUNIBalance).div(totalTokenUNIBalance)
      setUserBalance(myEth)
    }
  }, [totalTokenUNIBalance, tokenUNIBalance, contractETHBalance])

  useEffect(() => {
    if (poolShare && userTokenBalance && userBalance) setIsReady(true)
  }, [poolShare, userTokenBalance, userBalance])

  let liquidInfos = {
    poolShare: poolShare,
    userToken: userTokenBalance,
    userETH: userBalance,
    isReady: isReady,
    hasPool: hasPool
  }

  return [liquidInfos];
}

// Custom hook to query the AddLiquidity logs of a contract
export function useContractLogs(tokenAddress, userAddress) {
  const exchange = useExchangeContract(tokenAddress, false)

  const [logs, setLogs] = useState()

  useEffect(() => {
    if(exchange) getLogs()
  }, [exchange])

  async function getLogs() {
    let topic = ethers.utils.id("AddLiquidity(address,uint256,uint256)");
    let topicAddress = ethers.utils.hexZeroPad(userAddress, 32);
    let filter = {
      address: exchange.address,
      fromBlock: 6627994,
      topics: [ topic, topicAddress ]
    }
    const logs = await ethers.getDefaultProvider().getLogs(filter)
    logs.forEach((log) => {
      const decodeLog = (new ethers.utils.Interface(EXCHANGE_ABI)).parseLog(log)
      console.log(decodeLog)
      console.log("ETHERS", ethers.utils.formatEther(decodeLog.values.eth_amount))
      console.log("TOKENS", decodeLog.values.token_amount.toString())
    })
  }

  return logs 
}
