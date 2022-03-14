import { Point } from 'helper/point'
import { invert, randScalar } from 'helper/utils'

const MAX_STEPS = 10000
const STEP = BigInt(100_000)

export class TwistedElGamal {
  public C: Point // Commiment
  public D: Point // Decryption Handle
  public P: Point // Public Key

  constructor(m: bigint, s: bigint, z: bigint = randScalar()) {
    this.C = Point.G.multiply(m).add(Point.H.multiply(z))

    this.P = Point.H.multiply(invert(s))
    this.D = this.P.multiply(z)
  }

  private mine = (other: TwistedElGamal) => {
    if (!this.P.equals(other.P))
      throw new Error('Cannot add 2 commitments from 2 different keys')
  }

  static build = (C: Point, D: Point, P: Point): TwistedElGamal => {
    // Create an arbitrary instance
    const clone = new TwistedElGamal(randScalar(), randScalar())
    // Copy the info
    clone.C = C.clone()
    clone.D = D.clone()
    clone.P = P.clone()
    return clone
  }

  clone = (): TwistedElGamal => {
    return TwistedElGamal.build(this.C, this.D, this.P)
  }

  verify = (m: bigint, s: bigint) => {
    const dC = this.C.subtract(this.D.multiply(s))
    const _dC = Point.G.multiply(m)
    return dC.equals(_dC)
  }

  solve = (s: bigint): bigint | undefined => {
    for (let i = 0; i < MAX_STEPS; i++) {
      const m = BigInt(i) * STEP
      if (this.verify(m, s)) return m
    }
    return undefined
  }

  identify = (other: TwistedElGamal) => {
    return (
      this.C.equals(other.C) && this.D.equals(other.D) && this.P.equals(other.P)
    )
  }

  add = (other: TwistedElGamal) => {
    this.mine(other)
    const clone = this.clone()
    // C1 + C2 = Gm1 + Hz1 + Gm2 + Hz2 = G(m1+m2) + H(z1+z2)
    clone.C = clone.C.add(other.C)
    // D1 + D2 = Pz1 + Pz2 = P(z1+z2)
    clone.D = clone.D.add(other.D)
    return clone
  }

  subtract = (other: TwistedElGamal) => {
    this.mine(other)
    const clone = this.clone()
    // C1 - C2 = Gm1 + Hz1 - Gm2 - Hz2 = G(m1-m2) + H(z1-z2)
    clone.C = this.C.subtract(other.C)
    // D1 - D2 = Pz1 - Pz2 = P(z1-z2)
    clone.D = this.D.subtract(other.D)
    return clone
  }

  multiply = (scalar: bigint) => {
    const clone = this.clone()
    // Cx = Gmx + Hzx
    clone.C = this.C.multiply(scalar)
    // Dx = Pzx
    clone.D = this.D.multiply(scalar)
    return clone
  }

  divide = (scalar: bigint) => {
    const clone = this.clone()
    // C * x^-1 = Gm * x-1 + Hz * x^-1
    clone.C = this.C.divide(scalar)
    // D * x^-1 = Pz * x^-1
    clone.D = this.D.divide(scalar)
    return clone
  }
}
