import { mod } from 'helper/utils'
import { TwistedElGamal } from 'helper/twistedElGamal'
import { Multiplication, MultiplicationProof } from './multiplication'
import { PerdesenEquality, PerdesenEqualityProof } from './perdesenEquality'

/**
 * Square Root Proof
 *
 * Public Commitments:
 * A = aG + r1H
 * B = bG + r2H
 * C = cG + r3H
 * Q1 = abG + ar2H
 * Q2 = c^2*G + cr3H
 *
 * Prover:
 * M1 = Multiplication(A, B, Q1)
 * M2 = Multiplication(C, C, Q2)
 * PE = PerdesenEquality(Q1, Q2)
 *
 * Verifier:
 * sG + rH ?= cC1 + C4
 * sC2 ?= cC3 + C5
 */

export type SquareRootProof = {
  M1: MultiplicationProof
  M2: MultiplicationProof
  PE: PerdesenEqualityProof
}

export const SquareRoot = {
  prove: (
    A: TwistedElGamal,
    B: TwistedElGamal,
    C: TwistedElGamal,
    Q1: TwistedElGamal,
    Q2: TwistedElGamal,
    a: bigint,
    r1: bigint,
    b: bigint,
    r2: bigint,
    c: bigint,
    r3: bigint,
  ) => {
    if (c * c !== a * b)
      throw new Error('There is no integer square root of a multiplying b')
    const M1 = Multiplication.prove(A.C, B.C, Q1.C, a, r1)
    const M2 = Multiplication.prove(C.C, C.C, Q2.C, c, r3)
    const PE = PerdesenEquality.prove(
      mod(a * b),
      mod(a * r2),
      mod(c * r3),
      Q1.C,
      Q2.C,
    )
    return { M1, M2, PE }
  },
  verify: (
    A: TwistedElGamal,
    B: TwistedElGamal,
    C: TwistedElGamal,
    Q1: TwistedElGamal,
    Q2: TwistedElGamal,
    proof: SquareRootProof,
  ) => {
    const { M1, M2, PE } = proof
    let ok = true
    ok = ok && Multiplication.verify(A.C, B.C, Q1.C, M1)
    ok = ok && Multiplication.verify(C.C, C.C, Q2.C, M2)
    ok = ok && PerdesenEquality.verify(Q1.C, Q2.C, PE)
    return ok
  },
}
