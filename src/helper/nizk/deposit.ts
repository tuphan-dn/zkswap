import { Point } from 'helper/point'
import { mod, randScalar, sqrt } from 'helper/utils'
import { TwistedElGamal } from 'helper/twistedElGamal'
import { HybridEquality, HybridEqualityProof } from './hybridEquality'
import { SquareRoot, SquareRootProof } from './squareRoot'
import { Account } from 'store/ledger.reducer'

/**
 * Deposit Proof
 *
 * SR = SquareRoot(srcAmountA, srcAmountB, srcAmountLP, Q1, Q2, a, r1, b, r2, lp, r3)
 * HE1 = HybridEquality(srcAmountA, dstAmountA)
 * HE2 = HybridEquality(srcAmountB, dstAmountB)
 * HE3 = HybridEquality(dstAmountLP, srcAmountLP)
 */

export type DepositProof = {
  srcAmountA: TwistedElGamal
  srcAmountB: TwistedElGamal
  srcAmountLP: TwistedElGamal
  dstAmountA: TwistedElGamal
  dstAmountB: TwistedElGamal
  dstAmountLP: TwistedElGamal
  Q1: TwistedElGamal
  Q2: TwistedElGamal
  SR: SquareRootProof
  HE1: HybridEqualityProof
  HE2: HybridEqualityProof
  HE3: HybridEqualityProof
}

export const Deposit = {
  prove: (
    a: bigint,
    b: bigint,

    srcA: Account,
    srcB: Account,
    dstLP: Account,

    dstAPublicKey: Point,
    dstBPublicKey: Point,
    srcLPPublicKey: Point,
  ) => {
    const lp = sqrt(a * b)

    if (lp * lp !== a * b)
      throw new Error('There is no integer square root of a multiplying b')

    const s1 = srcA.s // secret of src A
    const s2 = srcB.s // secret of src B
    const s3 = dstLP.s // secret of dst LP
    const r1 = randScalar() // randomness of src amount A
    const r1_ = randScalar() // randomness of dst amount A
    const r2 = randScalar() // randomness of src amount B
    const r2_ = randScalar() // randomness of dst amount B
    const r3 = randScalar() // randomness of dst amount A
    const r3_ = randScalar() // randomness of src amount LP

    const srcAmountA = new TwistedElGamal(a, s1, r1)
    const srcAmountB = new TwistedElGamal(b, s2, r2)
    const dstAmountLP = new TwistedElGamal(lp, s3, r3)

    const dstAmountA = TwistedElGamal.build(
      Point.G.multiply(a).add(Point.H.multiply(r1_)),
      dstAPublicKey.multiply(r1_),
      dstAPublicKey,
    )
    const dstAmountB = TwistedElGamal.build(
      Point.G.multiply(b).add(Point.H.multiply(r2_)),
      dstBPublicKey.multiply(r2_),
      dstBPublicKey,
    )
    const srcAmountLP = TwistedElGamal.build(
      Point.G.multiply(lp).add(Point.H.multiply(r3_)),
      srcLPPublicKey.multiply(r3_),
      srcLPPublicKey,
    )

    const Q1 = new TwistedElGamal(mod(a * b), randScalar(), mod(a * r2))
    const Q2 = new TwistedElGamal(mod(lp * lp), randScalar(), mod(lp * r3_))

    const SR = SquareRoot.prove(
      srcAmountA,
      srcAmountB,
      srcAmountLP,
      Q1,
      Q2,
      a,
      r1,
      b,
      r2,
      lp,
      r3_,
    )
    const HE1 = HybridEquality.prove(s1, r1_, srcAmountA, dstAmountA)
    const HE2 = HybridEquality.prove(s2, r2_, srcAmountB, dstAmountB)
    const HE3 = HybridEquality.prove(s3, r3_, dstAmountLP, srcAmountLP)
    return {
      srcAmountA,
      srcAmountB,
      srcAmountLP,
      dstAmountA,
      dstAmountB,
      dstAmountLP,
      Q1,
      Q2,
      SR,
      HE1,
      HE2,
      HE3,
    }
  },
  verify: (proof: DepositProof) => {
    let ok = true
    const {
      srcAmountA,
      dstAmountA,
      srcAmountB,
      dstAmountB,
      srcAmountLP,
      dstAmountLP,
      Q1,
      Q2,
      SR,
      HE1,
      HE2,
      HE3,
    } = proof
    ok =
      ok && SquareRoot.verify(srcAmountA, srcAmountB, srcAmountLP, Q1, Q2, SR)
    ok = ok && HybridEquality.verify(srcAmountA, dstAmountA, HE1)
    ok = ok && HybridEquality.verify(srcAmountB, dstAmountB, HE2)
    ok = ok && HybridEquality.verify(dstAmountLP, srcAmountLP, HE3)
    return ok
  },
}
