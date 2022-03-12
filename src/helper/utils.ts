import { utils, CURVE } from '@noble/ed25519'
import { Point } from 'helper/point'

export const randScalar = (buf?: Uint8Array) => {
  const hex = buf || utils.randomBytes(32)
  const seed = BigInt('0x' + Buffer.from(hex).toString('hex'))
  const scalar = utils.mod(seed, CURVE.l)
  return scalar
}

export const randPoint = () => {
  return Point.BASE.multiply(randScalar())
}

export const mod = (n: bigint) => {
  return utils.mod(n, CURVE.l)
}

export const invert = (n: bigint) => {
  return utils.invert(n, CURVE.l)
}

export const padding = (bin: string, bits: number = 64) => {
  if (bin.length > bits)
    throw new Error('The bits length exceed the padding length')
  let re = bin
  while (re.length < bits) re = '0' + re
  return re
}

export const sqrt = (a: bigint): bigint => {
  const self = a.valueOf()
  const one = BigInt(1)
  const two = BigInt(2)
  if (self < two) return self
  let bits = BigInt(a.toString(2).length + 1) / two
  let start = one << (bits - one)
  let end = one << (bits + one)
  while (start < end) {
    end = (start + end) / two
    start = self / end
  }
  return end
}
