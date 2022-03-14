import { hash } from 'tweetnacl'
import { Point } from 'helper/point'
import { randScalar } from 'helper/utils'

/**
 * Fiat-Shamir heuristic
 * @param agrs
 * @returns
 */
export const noninteractive = (...agrs: Point[]): bigint => {
  const seed = agrs.reduce(
    (prev, cur) => new Uint8Array([...prev, ...cur.toRawBytes()]),
    new Uint8Array([]),
  )
  const c = randScalar(hash(seed))
  return c
}
