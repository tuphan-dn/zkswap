import { Point } from 'helper/point'
import { invert, randScalar } from 'helper/utils'
import { TwistedElGamal } from 'helper/twistedElGamal'
import { HybridEquality, HybridEqualityProof } from './hybridEquality'
import { Account } from 'store/ledger.reducer'
import { PRECISION } from 'hooks/usePrice'

/**
 * Product Constant Proof
 *
 * Public Commitments:
 *
 * Prover:
 * srcAmount A
 */
export type ProductConstantProof = {
  gamma: bigint
  srcBidAmount: TwistedElGamal
  dstAskAmount: TwistedElGamal
  bidAdjustment: TwistedElGamal
  askAdjustment: TwistedElGamal
  equalityBidProof: HybridEqualityProof
  equalityAskProof: HybridEqualityProof
}

export const ProductConstant = {
  prove: (
    gamma: bigint,
    rbid: bigint,
    rask: bigint,
    src: TwistedElGamal,
    dst: TwistedElGamal,
    bidTreasury: Account,
    askTreasury: Account,
  ): ProductConstantProof => {
    if (gamma >= PRECISION) throw new Error('Invalid gamma')
    // Generate bid-side amount for user and proof of equality
    const bidAdjustmentAmount =
      rbid * PRECISION - ((rbid * PRECISION) / gamma) * gamma
    const bidAmount = (rbid * PRECISION - bidAdjustmentAmount) / gamma - rbid
    const bidAdjustment = new TwistedElGamal(
      bidAdjustmentAmount,
      bidTreasury.s,
      randScalar(),
    )
    const r1 = randScalar()
    const srcBidAmount = TwistedElGamal.build(
      Point.G.multiply(bidAmount).add(Point.H.multiply(r1)),
      src.P.multiply(r1),
      src.P,
    )
    const dstBidAmount = ProductConstant.computeDstBidAmount(
      gamma,
      bidTreasury.amount,
      bidAdjustment,
    )
    const equalityBidProof = HybridEquality.prove(
      bidTreasury.s,
      r1,
      dstBidAmount,
      srcBidAmount,
    )
    // Generate ask-side amount for user and proof of equality
    const askAdjustmentAmount =
      rask * gamma - ((rask * gamma) / PRECISION) * PRECISION
    const askAmount = rask - (rask * gamma - askAdjustmentAmount) / PRECISION
    const askAdjustment = new TwistedElGamal(
      askAdjustmentAmount,
      askTreasury.s,
      randScalar(),
    )
    const srcAskAmount = ProductConstant.computeSrcAskAmount(
      gamma,
      askTreasury.amount,
      askAdjustment,
    )
    const r2 = randScalar()
    const dstAskAmount = TwistedElGamal.build(
      Point.G.multiply(askAmount).add(Point.H.multiply(r2)),
      dst.P.multiply(r2),
      dst.P,
    )
    const equalityAskProof = HybridEquality.prove(
      askTreasury.s,
      r2,
      srcAskAmount,
      dstAskAmount,
    )
    // Return proof
    return {
      gamma,
      srcBidAmount,
      dstAskAmount,
      bidAdjustment,
      askAdjustment,
      equalityBidProof,
      equalityAskProof,
    }
  },

  verify: (
    bidTreasuryAmount: TwistedElGamal,
    askTreasuryAmount: TwistedElGamal,
    proof: ProductConstantProof,
  ): boolean => {
    const {
      gamma,
      srcBidAmount,
      dstAskAmount,
      bidAdjustment,
      askAdjustment,
      equalityBidProof,
      equalityAskProof,
    } = proof
    let ok = true
    // Check equality of bid side
    const dstBidAmount = ProductConstant.computeDstBidAmount(
      gamma,
      bidTreasuryAmount,
      bidAdjustment,
    )
    ok =
      ok && HybridEquality.verify(dstBidAmount, srcBidAmount, equalityBidProof)
    // Check equality of ask side
    const srcAskAmount = ProductConstant.computeSrcAskAmount(
      gamma,
      askTreasuryAmount,
      askAdjustment,
    )
    ok =
      ok && HybridEquality.verify(srcAskAmount, dstAskAmount, equalityAskProof)
    // Return
    return ok
  },

  computeDstBidAmount: (
    gamma: bigint,
    bidTreasuryAmount: TwistedElGamal,
    bidAdjustment: TwistedElGamal,
  ): TwistedElGamal => {
    return bidTreasuryAmount
      .multiply(PRECISION)
      .subtract(bidAdjustment)
      .multiply(invert(gamma))
      .subtract(bidTreasuryAmount)
  },

  computeSrcAskAmount: (
    gamma: bigint,
    askTreasuryAmount: TwistedElGamal,
    askAdjustment: TwistedElGamal,
  ): TwistedElGamal => {
    return askTreasuryAmount.subtract(
      askTreasuryAmount
        .multiply(gamma)
        .subtract(askAdjustment)
        .multiply(invert(PRECISION)),
    )
  },
}
