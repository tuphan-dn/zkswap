import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { PublicKey } from '@solana/web3.js'

import { AppState } from 'store'

export const useAccount = (publicKey: PublicKey) => {
  const { ledger } = useSelector((state: AppState) => state)

  const account = useMemo(() => {
    const account = { ...ledger[publicKey.toBase58()] }
    if (account && account.type === 'account') return account
    return undefined
  }, [ledger, publicKey])

  return account
}
