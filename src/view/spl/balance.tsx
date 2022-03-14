import { PublicKey } from '@solana/web3.js'

import { useAccount } from 'hooks/useAccount'
import { hashmap } from 'helper/hashmap'

export type BalanceProps = { publicKey: PublicKey }

const Balance = ({ publicKey }: BalanceProps) => {
  const account = useAccount(publicKey)

  let balance = 0
  if (account && account.type === 'account') {
    const { amount } = account
    const commitment = amount.C.subtract(amount.D.multiply(account.s)).toHex()
    balance = hashmap(commitment) || 0
  }

  return <span>{balance}</span>
}

export default Balance
