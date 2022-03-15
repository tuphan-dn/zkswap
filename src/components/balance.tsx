import { PublicKey } from '@solana/web3.js'

import { useAccount } from 'hooks/useAccount'
import { hashmap } from 'helper/hashmap'
import { useMemo } from 'react'
import { numeric } from 'helper/utils'

export type BalanceProps = { publicKey?: PublicKey }

const Balance = ({ publicKey }: BalanceProps) => {
  const account = useAccount(publicKey)

  const balance = useMemo(() => {
    if (!account || account.type !== 'account') return 0
    const { amount } = account
    const commitment = amount.C.subtract(amount.D.multiply(account.s)).toHex()
    return hashmap(commitment) || 0
  }, [account])

  return <span>{numeric(balance).format('0,0.[00]')}</span>
}

export default Balance
