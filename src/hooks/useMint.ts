import { useSelector } from 'react-redux'
import { PublicKey } from '@solana/web3.js'

import { AppState } from 'store'

export const useMint = (mintPublicKey: PublicKey) => {
  const { ledger } = useSelector((state: AppState) => state)
  return ledger[mintPublicKey.toBase58()]
}
