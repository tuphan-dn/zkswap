import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { PublicKey } from '@solana/web3.js'

import { AppState } from 'store'
import { hashmap } from 'helper/hashmap'

export const useBalance = (publicKey?: PublicKey): number => {
  const { ledger } = useSelector((state: AppState) => state)

  const commitment = useMemo(() => {
    if (!publicKey) return ''
    const account = ledger[publicKey.toBase58()]
    if (!account || account.type !== 'account') return ''
    const amount = account.amount
    return amount.C.subtract(amount.D.multiply(account.s)).toHex()
  }, [ledger, publicKey])

  return hashmap(commitment) || 0
}
