/**
 * @relayin/error-handler
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ErrorsConfig } from './Contracts'

/**
 * Parses error codes config for errors and report them early
 * in the development cycle
 */
export function parseConfigForErrors (config: ErrorsConfig) {
  const bucketMax = config.codesBucket * 2

  Object.keys(config.errorCodes).forEach((code) => {
    if (Number(code) < config.codesBucket) {
      throw new Error(`Error code ${code} must be over codesBucket range of ${config.codesBucket}`)
    }

    if (Number(code) > bucketMax) {
      throw new Error(`Error code ${code} must be under codesBucket range of ${bucketMax}`)
    }

    if (!config.errorCodes[code].message) {
      throw new Error('Each error code inside config/errorCodes.ts must have a message')
    }
  })

  Object.keys(config.exceptionCodes).forEach((code) => {
    const errorCode = config.exceptionCodes[code]
    if (!config.errorCodes[errorCode]) {
      throw new Error(`Error code ${errorCode} used by ${code} doesn't exists in list of errorCodes`)
    }
  })

  if (config.validationCodes) {
    Object.keys(config.validationCodes).forEach((code) => {
      const errorCode = config.validationCodes![code]
      if (!config.errorCodes[errorCode]) {
        throw new Error(`Error code ${errorCode} used by ${code} rule doesn't exists in list of errorCodes`)
      }
    })
  }
}
