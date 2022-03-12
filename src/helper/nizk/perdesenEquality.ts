import { Point } from 'helper/point'
import { mod, randScalar } from 'helper/utils'
import { noninteractive } from './fiatShamirHeuristic'

/**
 * Perdesen Equality Proof
 *
 * Public Commitments:
 * C1 = mG + r1H
 * C2 = mG + r2H
 *
 * Prover:
 * r3, r4, r5 <-$- Zp
 * C3 = r3G + r4H
 * C4 = r3G + r5H
 * c = Hash(C1, C2, C3, C4)
 * z1 = cm + r3
 * z2 = cr1 + r4
 * z3 = cr2 + r5
 * Proof { C1, C2, C3, C4, z1, z2, z3 }
 *
 * Verifier:
 * C3 + cC1 ?= z1G + z2H
 * C4 + cC2 ?= z1G + z3H
 */

export type PerdesenEqualityProof = {
  C3: Point
  C4: Point
  z1: bigint
  z2: bigint
  z3: bigint
}

export const PerdesenEquality = {
  prove: (
    m: bigint,
    r1: bigint,
    r2: bigint,
    C1: Point,
    C2: Point,
  ): PerdesenEqualityProof => {
    const r3 = randScalar()
    const r4 = randScalar()
    const r5 = randScalar()

    const C3 = Point.G.multiply(r3).add(Point.H.multiply(r4))
    const C4 = Point.G.multiply(r3).add(Point.H.multiply(r5))

    const c = noninteractive(C1, C2, C3, C4)
    const z1 = mod(c * m + r3)
    const z2 = mod(c * r1 + r4)
    const z3 = mod(c * r2 + r5)

    return { C3, C4, z1, z2, z3 }
  },

  verify: (C1: Point, C2: Point, proof: PerdesenEqualityProof): boolean => {
    const { C3, C4, z1, z2, z3 } = proof
    const c = noninteractive(C1, C2, C3, C4)
    const L1 = C3.add(C1.multiply(c))
    const R1 = Point.G.multiply(z1).add(Point.H.multiply(z2))
    const L2 = C4.add(C2.multiply(c))
    const R2 = Point.G.multiply(z1).add(Point.H.multiply(z3))
    return L1.equals(R1) && L2.equals(R2)
  },
}
