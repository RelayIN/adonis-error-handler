/**
 * @relayin/error-handler
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ErrorsConfig, ErrorHandlerContract } from '../Contracts'
import { validationCodes } from '../validationCodes'
import { ErrorFormatter } from '../ErrorFormatter'

/**
 * All of the required members must be exported from `config/errorCodes.ts`
 * file.
 */
const REQUIRED_MEMBERS = ['errorCodes', 'exceptionCodes', 'codesBucket']

export class ErrorHandler implements ErrorHandlerContract {
  private _exceptionsRef: { [key: string]: string } = {}

  constructor (private _config: ErrorsConfig) {
  }

  /**
   * Assert that error code is within the codes bucket range
   */
  private _validateErrorCode (code: number) {
    const bucketMax = this._config.codesBucket + 1000

    if (Number(code) < this._config.codesBucket) {
      throw new Error(`Error code ${code} must be over codesBucket range of ${this._config.codesBucket}`)
    }

    if (Number(code) > bucketMax) {
      throw new Error(`Error code ${code} must be under codesBucket range of ${bucketMax}`)
    }
  }

  /**
   * Assert that codeValue object has the message property
   */
  private _validateErrorMessage (codeValue: { message: string }) {
    if (!codeValue.message) {
      throw new Error('Each error code inside config/errorCodes.ts must have a message')
    }
  }

  /**
   * Validates exception code to ensure that it references an existing
   * `errorCode`.
   */
  private _validateExceptionCode (code: string, errorCode: number) {
    if (!this._config.errorCodes[errorCode]) {
      throw new Error(`Error code ${errorCode} used by ${code} doesn't exists in list of errorCodes`)
    }
  }

  /**
   * Validates validation code to ensure  that it references an existing
   * `errorCode`.
   */
  private _validateValidationCode (rule: string, errorCode: number) {
    if (!this._config.errorCodes[errorCode]) {
      throw new Error(`Error code ${errorCode} used by ${rule} rule doesn't exists in list of errorCodes`)
    }
  }

  /**
   * Validates the config object to ensure it has all
   * members
   */
  private _validateHasAllMembers () {
    if (!this._config) {
      throw new Error('Create "config/errorCodes.ts" file')
    }

    REQUIRED_MEMBERS.forEach((key) => {
      if (!this._config[key]) {
        throw new Error(`Export "${key}" from "config/errorCodes.ts" file`)
      }
    })
  }

  /**
   * Parse config and also ensure that it's valid
   */
  public parse () {
    this._validateHasAllMembers()

    Object.keys(this._config.errorCodes).forEach((code) => {
      this._validateErrorCode(Number(code))
      this._validateErrorMessage(this._config.errorCodes[code])
    })

    Object.keys(this._config.exceptionCodes).forEach((code) => {
      this._validateExceptionCode(code, this._config.exceptionCodes[code])

      /**
       * Store reference to the exception code to be used later for reference
       */
      this._exceptionsRef[code] = code
    })

    if (this._config.validationCodes) {
      Object.keys(this._config.validationCodes).forEach((code) => {
        this._validateValidationCode(code, this._config.validationCodes![code])
      })

      /**
       * Merge user config codes with existing validation codes
       */
      Object.assign(validationCodes, this._config.validationCodes)
    }
  }

  /**
   * Returns [[ErrorFormatter]] class to be passed to indicative
   * for formatting errors
   */
  public getFormatter (): { new(): ErrorFormatter } {
    return ErrorFormatter
  }

  /**
   * Returns exception handler for handling HTTP exceptions and making
   * consistent API response
   */
  public async handleException (error, { response }) {
    const code = error.code || 'E_RUNTIME_EXCEPTION'
    const status = error.status || 500

    let clientCode = 1000
    let clientMessage = 'Unable to process request'

    if (this._config.exceptionCodes[code]) {
      clientCode = this._config.exceptionCodes[code]
      clientMessage = this._config.errorCodes[clientCode].message
    }

    response.status(status).send({ title: clientMessage, code: clientCode })
  }

  /**
   * Returns reference to exceptions list
   */
  public exceptions <T extends keyof any> (): { [K in T]: K } {
    return this._exceptionsRef as { [K in T]: K }
  }
}
