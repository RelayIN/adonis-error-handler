/**
 * @relayin/error-handler
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ErrorsConfig } from '../Contracts'

/**
 * Global exception handler for AdonisJs HTTP requests. It makes use of `config/errorCodes.ts`
 * file to pull the correct message and code for a given exception.
 *
 * If config for the given exception code is missing, then generic values are used.
 */
export class ExceptionHandler {
  constructor (private _config: ErrorsConfig) {
  }

  /**
   * Handles the global exceptions during HTTP request lifecycle in AdonisJs
   */
  public async handle (error, { response }) {
    const code = error.code || 'E_RUNTIME_EXCEPTION'
    const status = error.status || 500

    let clientCode = 10000
    let clientMessage = 'Unable to process request'

    if (this._config.exceptionCodes[code]) {
      clientCode = this._config.exceptionCodes[code]
      clientMessage = this._config.errorCodes[clientCode].message
    }

    response.status(status).send({ title: clientMessage, code: clientCode })
  }
}
