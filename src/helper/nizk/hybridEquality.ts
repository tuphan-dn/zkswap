import { Point } from 'helper/point'
import { mod, randScalar } from 'helper/utils'
import { TwistedElGamal } from 'helper/twistedElGamal'
import { noninteractive } from './fiatShamirHeuristic'

/**
 * Hybrid Equality Proof
 *
 * Public Commitments:
 * C1 (known secret only)
 * C2 (known randomness only)
 *
 * Prover: s1 is secret of C1, r2 is randomness of C2
 * z1, z2 <-$- Zp
 * C = Hz2 - z1C1<D>
 * c = Hash(C1, C2, C)
 * s = cs1 + z1
 * r = cr2 + z2
 *
 * Verify:
 * cC1 - sC1<D> + rH = cC2 + C
 */

export type HybridEqualityProof = {
  s: bigint
  r: bigint
  C: Point
}

export const HybridEquality = {
  prove: (
    s1: bigint,
    r2: bigint,
    C1: TwistedElGamal,
    C2: TwistedElGamal,
  ): HybridEqualityProof => {
    const z1 = randScalar()
    const z2 = randScalar()
    const C = Point.H.multiply(z2).subtract(C1.D.multiply(z1))
    const c = noninteractive(C1.C, C1.D, C2.C, C2.D, C)
    const s = mod(c * s1 + z1)
    const r = mod(c * r2 + z2)
    return { s, r, C }
  },
  verify: (
    C1: TwistedElGamal,
    C2: TwistedElGamal,
    proof: HybridEqualityProof,
  ): boolean => {
    const { s, r, C } = proof
    const c = noninteractive(C1.C, C1.D, C2.C, C2.D, C)
    const L = C1.C.multiply(c)
      .subtract(C1.D.multiply(s))
      .add(Point.H.multiply(r))
    const R = C2.C.multiply(c).add(C)
    return L.equals(R)
  },
}
