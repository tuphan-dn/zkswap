import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { PublicKey } from '@solana/web3.js'

import { AppState } from 'store'

export const useAccount = (accountPublicKey: PublicKey) => {
  const { ledger } = useSelector((state: AppState) => state)

  const account = useMemo(() => {
    const account = Object.values(ledger).find(
      ({ publicKey }) => publicKey.toBase58() === accountPublicKey.toBase58(),
    )
    if (account && account.type === 'account') return account
  }, [ledger, accountPublicKey])

  return account
}
