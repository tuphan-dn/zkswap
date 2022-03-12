import { Point } from 'helper/point'
import { mod } from 'helper/utils'

/**
 * Core vector
 */
export abstract class CoreVector<T> {
  private _vector: Array<T>

  constructor(vector: Array<T>) {
    this._vector = [...vector]
  }

  private halfLength = () => {
    if (this.value.length % 2 === 1)
      throw new Error(
        `Cannot seperate a odd-length vector: ${this.value.length}`,
      )
    return this.value.length / 2
  }

  protected compareLength = (other: any, strict = true) => {
    if (this.value.length !== other.value.length) {
      if (!strict) return false
      throw new Error(
        `The length of 2 vectors don't equal: ${this.value.length} and ${other.value.length}`,
      )
    }
    return this.value.length
  }

  protected abstract wrap(v: Array<T>): this
  protected abstract equals(v: this): boolean

  get naked() {
    if (this.value.length !== 1)
      throw new Error('Cannot get naked a vector > 1')
    return this.value[0]
  }

  get value() {
    return this._vector
  }

  get length() {
    return this._vector.length
  }

  get left() {
    const halfIndex = this.halfLength()
    return this.wrap(this.value.slice(0, halfIndex))
  }

  get right() {
    const halfIndex = this.halfLength()
    return this.wrap(this.value.slice(halfIndex))
  }

  get even() {
    return this.wrap(this.value.filter((_, i) => i % 2 === 0))
  }

  get odd() {
    return this.wrap(this.value.filter((_, i) => i % 2 === 1))
  }
}

/**
 * Scalar vector
 */
export class ScalarVector extends CoreVector<bigint> {
  constructor(vector: Array<bigint>) {
    super(vector)
  }

  wrap = (v: Array<bigint>) => new ScalarVector(v) as this

  equals = (other: ScalarVector) => {
    const length = this.compareLength(other, false)
    if (!length) return false
    for (let i = 0; i < length; i++) {
      if (this.value[i] !== other.value[i]) return false
    }
    return true
  }

  addScalarVector = (other: ScalarVector) => {
    this.compareLength(other)
    return this.wrap(
      this.value.map((_, i) => mod(this.value[i] + other.value[i])),
    )
  }

  mulScalar = (scalar: bigint) => {
    return this.wrap(this.value.map((v) => mod(v * scalar)))
  }

  mulScalarVector = (other: ScalarVector) => {
    this.compareLength(other)
    return this.value
      .map((_, i) => mod(this.value[i] * other.value[i]))
      .reduce((m, n) => mod(m + n))
  }

  mulPointVector = (other: PointVector) => {
    this.compareLength(other)
    return this.value
      .map((_, i) => other.value[i].multiply(this.value[i]))
      .reduce((m, n) => m.add(n))
  }
}

/**
 * Point vector
 */
export class PointVector extends CoreVector<Point> {
  constructor(vector: Array<Point>) {
    super(vector)
  }

  wrap = (v: Array<Point>) => new PointVector(v) as this

  equals = (other: PointVector) => {
    const length = this.compareLength(other, false)
    if (!length) return false
    for (let i = 0; i < length; i++) {
      if (!this.value[i].equals(other.value[i])) return false
    }
    return true
  }

  addPointVector = (other: PointVector) => {
    this.compareLength(other)
    return this.wrap(
      this.value.map((_, i) => this.value[i].add(other.value[i])),
    )
  }

  mulScalar = (scalar: bigint) => {
    return this.wrap(this.value.map((v) => v.multiply(scalar)))
  }

  mulScalarVector = (other: ScalarVector) => {
    return other.mulPointVector(this)
  }
}
