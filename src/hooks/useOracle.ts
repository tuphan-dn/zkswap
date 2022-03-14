import { useSelector } from 'react-redux'

import { ProductConstant } from 'helper/nizk'
import { Point } from 'helper/point'
import { AppState } from 'store'
import { useAccount } from './useAccount'
import { useMemo } from 'react'
import { Direction } from 'store/swap.reducer'

export const useOracle = (
  gamma: bigint,
  srcPublicKey?: Point,
  dstPublicKey?: Point,
) => {
  const {
    swap: { direction },
    oracle: { treasuryAPublicKey, treasuryBPublicKey, ra, rb },
  } = useSelector((state: AppState) => state)
  const treasuryA = useAccount(treasuryAPublicKey)
  const treasuryB = useAccount(treasuryBPublicKey)

  const proof = useMemo(() => {
    if (!gamma || !srcPublicKey || !dstPublicKey || !treasuryA || !treasuryB)
      return undefined
    return ProductConstant.prove(
      gamma,
      direction === Direction.AB ? ra : rb,
      direction === Direction.AB ? rb : ra,
      srcPublicKey,
      dstPublicKey,
      direction === Direction.AB ? treasuryA : treasuryB,
      direction === Direction.AB ? treasuryB : treasuryA,
    )
  }, [
    gamma,
    srcPublicKey,
    dstPublicKey,
    treasuryA,
    treasuryB,
    ra,
    rb,
    direction,
  ])

  return proof
}
