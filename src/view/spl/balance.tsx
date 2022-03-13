import { useSelector } from 'react-redux'
import { PublicKey } from '@solana/web3.js'

import { useAccount } from 'hooks/useAccount'
import { AppState } from 'store'

export type BalanceProps = { publicKey: PublicKey }

const Balance = ({ publicKey }: BalanceProps) => {
  const { hashmap } = useSelector((state: AppState) => state)
  const account = useAccount(publicKey)

  let balance = 0
  if (account) {
    const { amount } = account
    const commitment = amount.C.subtract(amount.D.multiply(account.s))
    balance = hashmap[commitment.toHex()] || 0
  }

  return <span>{balance}</span>
}

export default Balance
