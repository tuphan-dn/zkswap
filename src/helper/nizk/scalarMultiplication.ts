import { TwistedElGamal } from 'helper/twistedElGamal'

/**
 * Scalar Multiplication Proof
 */

export type ScalarMultiplicationProof = {
  scalar: bigint
  commitment: TwistedElGamal
  multipliedCommitment: TwistedElGamal
}

export const ScalarMultiplication = {
  prove: (
    scalar: bigint,
    commitment: TwistedElGamal,
  ): ScalarMultiplicationProof => {
    return {
      scalar,
      commitment,
      multipliedCommitment: commitment.multiply(scalar),
    }
  },

  verify: (proof: ScalarMultiplicationProof): boolean => {
    const { scalar, commitment, multipliedCommitment } = proof
    return commitment.multiply(scalar).identify(multipliedCommitment)
  },
}
