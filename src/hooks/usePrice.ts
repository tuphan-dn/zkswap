import { useSelector } from 'react-redux'

import { AppState } from 'store'

export const PRECISION = BigInt(1_000_000_000)

export const getPrice = (ra: bigint, rb: bigint) => {
  if (!ra) return BigInt(0)
  return (rb * PRECISION) / ra
}

export const usePrice = () => {
  const {
    oracle: { ra, rb },
  } = useSelector((state: AppState) => state)

  return getPrice(ra, rb)
}
