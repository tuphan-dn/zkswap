import { CURVE, Point as _Point, utils } from '@noble/ed25519'
import { hash } from 'tweetnacl'
import { invert } from 'helper/utils'

export type Hex = Uint8Array | string
export type PrivKey = Hex | bigint | number

export class Point {
  private _point: _Point
  constructor(x: bigint, y: bigint) {
    this._point = new _Point(x, y)
  }

  static wrap = (p: _Point) => new Point(p.x, p.y)
  static BASE = Point.wrap(_Point.BASE)
  static ZERO = Point.wrap(_Point.ZERO)
  static fromHex = (hex: Hex, strict?: boolean) =>
    Point.wrap(_Point.fromHex(hex, strict))
  static fromPrivateKey = async (privateKey: PrivKey) =>
    Point.wrap(await _Point.fromPrivateKey(privateKey))

  static G = this.BASE
  static H = this.BASE.multiply(
    utils.mod(
      BigInt(`0x${utils.bytesToHex(hash(this.G.toRawBytes()))}`),
      CURVE.l,
    ),
  )

  clone = () => new Point(this._point.x, this._point.y)
  toRawBytes = () => this._point.toRawBytes()
  toHex = () => this._point.toHex()
  toX25519 = () => this._point.toX25519()
  isTorsionFree = () => this._point.isTorsionFree()
  equals = (other: Point) => this._point.equals(other._point)
  negate = () => Point.wrap(this._point.negate())
  add = (other: Point) => Point.wrap(this._point.add(other._point))
  subtract = (other: Point) => Point.wrap(this._point.subtract(other._point))
  multiply = (scalar: bigint) => {
    if (!scalar) return Point.ZERO
    return Point.wrap(this._point.multiply(scalar))
  }
  divide = (scalar: bigint) => {
    if (!scalar) throw new Error('Cannot be divided by zero')
    return Point.wrap(this._point.multiply(invert(scalar)))
  }
}
