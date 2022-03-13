import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { PublicKey } from '@solana/web3.js'

import { AppState } from 'store'

export const useMint = (publicKey?: PublicKey) => {
  const { ledger } = useSelector((state: AppState) => state)

  const mint = useMemo(() => {
    if (!publicKey) return undefined
    const mint = { ...ledger[publicKey.toBase58()] }
    if (mint && mint.type === 'mint') return mint
    return undefined
  }, [ledger, publicKey])

  return mint
}
