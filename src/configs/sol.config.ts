import { Env } from 'configs'

/**
 * Contructor
 */
type Conf = {}

const conf: Record<Env, Conf> = {
  /**
   * Development configurations
   */
  development: {},

  /**
   * Staging configurations
   */
  staging: {},

  /**
   * Production configurations
   */
  production: {},
}

/**
 * Module exports
 */
export default conf
