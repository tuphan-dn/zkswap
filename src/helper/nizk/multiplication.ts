import { Point } from 'helper/point'
import { mod, randScalar } from 'helper/utils'
import { noninteractive } from './fiatShamirHeuristic'

/**
 * Multiplication Proof
 *
 * Public Commitments:
 * A = aG + r1H
 * B = bG + r2H
 * Q = abG + ar2H
 *
 * Prover:
 * z1, z2 <-$- Zp
 * C1 = z1G + z2H
 * C2 = z1B = z1bG + z1r2H
 * c = Hash(A, B, Q, C1, C2)
 * s = ca + z1
 * r = cr1 + z2
 * Proof {s, r, C1, C2}
 *
 * Verifier:
 * sG + rH ?= cA + C1
 * sB ?= cQ + C2
 */

export type MultiplicationProof = {
  s: bigint
  r: bigint
  C1: Point
  C2: Point
}

export const Multiplication = {
  prove: (
    A: Point,
    B: Point,
    Q: Point,
    a: bigint,
    r1: bigint,
  ): MultiplicationProof => {
    const z1 = randScalar()
    const z2 = randScalar()
    const C1 = Point.G.multiply(z1).add(Point.H.multiply(z2))
    const C2 = B.multiply(z1)
    const c = noninteractive(A, B, Q, C1, C2)
    const s = mod(c * a + z1)
    const r = mod(c * r1 + z2)
    return { s, r, C1, C2 }
  },
  verify: (A: Point, B: Point, Q: Point, proof: MultiplicationProof) => {
    let ok = true
    const { s, r, C1, C2 } = proof
    const c = noninteractive(A, B, Q, C1, C2)
    const L1 = Point.G.multiply(s).add(Point.H.multiply(r))
    const R1 = A.multiply(c).add(C1)
    ok = ok && L1.equals(R1)
    const L2 = B.multiply(s)
    const R2 = Q.multiply(c).add(C2)
    ok = ok && L2.equals(R2)
    return ok
  },
}
