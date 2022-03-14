import { useMemo } from 'react'

import { hashmap } from 'helper/hashmap'
import { Account } from 'store/ledger.reducer'
import { TwistedElGamal } from 'helper/twistedElGamal'

export const useAmount = (
  account?: Account,
  amount?: TwistedElGamal,
): number => {
  const commitment = useMemo(() => {
    if (!account || account.type !== 'account' || !amount) return ''
    return amount.C.subtract(amount.D.multiply(account.s)).toHex()
  }, [account, amount])

  return hashmap(commitment) || 0
}
