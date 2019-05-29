import React, { useState, useContext, useEffect } from 'react'

export const AppContext = React.createContext([{}, () => {}])

export default function AppProvider({ children }) {
  const [address, setAddress] = useState()

  useEffect(() => {
    console.log("New address")
  }, [address])

  return <AppContext.Provider value={[address, setAddress]}>{children}</AppContext.Provider>
}

export function useAppContext() {
  return useContext(AppContext)
}