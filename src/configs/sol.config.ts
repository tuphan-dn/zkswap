import { Env } from 'configs'

/**
 * Contructor
 */
type Conf = {
  supply: bigint
  reserve: bigint
}

const conf: Record<Env, Conf> = {
  /**
   * Development configurations
   */
  development: {
    supply: BigInt(10 ** 6),
    reserve: BigInt(9 * 10 ** 5),
  },

  /**
   * Staging configurations
   */
  staging: {
    supply: BigInt(10 ** 6),
    reserve: BigInt(9 * 10 ** 5),
  },

  /**
   * Production configurations
   */
  production: {
    supply: BigInt(10 ** 6),
    reserve: BigInt(9 * 10 ** 5),
  },
}

/**
 * Module exports
 */
export default conf
