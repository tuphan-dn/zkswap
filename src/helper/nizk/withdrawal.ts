import { Point } from 'helper/point'
import { mod, randScalar, sqrt } from 'helper/utils'
import { TwistedElGamal } from 'helper/twistedElGamal'
import { HybridEquality, HybridEqualityProof } from './hybridEquality'
import { SquareRoot, SquareRootProof } from './squareRoot'
import { Account } from 'store/ledger.reducer'

/**
 * Withdrawal Proof
 *
 * SR = SquareRoot(dstAmountA, dstAmountB, dstAmountLP, Q1, Q2, a, r1, b, r2, lp, r3)
 * HE1 = HybridEquality(dstAmountA, srcAmountA)
 * HE2 = HybridEquality(dstAmountB, srcAmountB)
 * HE3 = HybridEquality(srcAmountLP, dstAmountLP)
 */

export type WithdrawalProof = {
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

export const Withdrawal = {
  prove: (
    a: bigint,
    b: bigint,

    dstA: Account,
    dstB: Account,
    srcLP: Account,

    srcAPublicKey: Point,
    srcBPublicKey: Point,
    dstLPPublicKey: Point,
  ) => {
    const lp = sqrt(a * b)

    if (lp * lp !== a * b)
      throw new Error('There is no integer square root of a multiplying b')

    const s1 = dstA.s // secret of dst A
    const s2 = dstB.s // secret of dst B
    const s3 = srcLP.s // secret of src LP
    const r1 = randScalar() // randomness of dst amount A
    const r1_ = randScalar() // randomness of src amount A
    const r2 = randScalar() // randomness of dst amount B
    const r2_ = randScalar() // randomness of src amount B
    const r3 = randScalar() // randomness of src amount A
    const r3_ = randScalar() // randomness of dst amount LP

    const dstAmountA = new TwistedElGamal(a, s1, r1)
    const dstAmountB = new TwistedElGamal(b, s2, r2)
    const srcAmountLP = new TwistedElGamal(lp, s3, r3)

    const srcAmountA = TwistedElGamal.build(
      Point.G.multiply(a).add(Point.H.multiply(r1_)),
      srcAPublicKey.multiply(r1_),
      srcAPublicKey,
    )
    const srcAmountB = TwistedElGamal.build(
      Point.G.multiply(b).add(Point.H.multiply(r2_)),
      srcBPublicKey.multiply(r2_),
      srcBPublicKey,
    )
    const dstAmountLP = TwistedElGamal.build(
      Point.G.multiply(lp).add(Point.H.multiply(r3_)),
      dstLPPublicKey.multiply(r3_),
      dstLPPublicKey,
    )

    const Q1 = new TwistedElGamal(mod(a * b), randScalar(), mod(a * r2))
    const Q2 = new TwistedElGamal(mod(lp * lp), randScalar(), mod(lp * r3_))

    const SR = SquareRoot.prove(
      dstAmountA,
      dstAmountB,
      dstAmountLP,
      Q1,
      Q2,
      a,
      r1,
      b,
      r2,
      lp,
      r3_,
    )
    const HE1 = HybridEquality.prove(s1, r1_, dstAmountA, srcAmountA)
    const HE2 = HybridEquality.prove(s2, r2_, dstAmountB, srcAmountB)
    const HE3 = HybridEquality.prove(s3, r3_, srcAmountLP, dstAmountLP)
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
  verify: (proof: WithdrawalProof) => {
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
      ok && SquareRoot.verify(dstAmountA, dstAmountB, dstAmountLP, Q1, Q2, SR)
    ok = ok && HybridEquality.verify(dstAmountA, srcAmountA, HE1)
    ok = ok && HybridEquality.verify(dstAmountB, srcAmountB, HE2)
    ok = ok && HybridEquality.verify(srcAmountLP, dstAmountLP, HE3)
    return ok
  },
}
