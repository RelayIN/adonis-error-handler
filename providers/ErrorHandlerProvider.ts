/**
 * @relayin/error-handler
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ExceptionHandler } from '../src/ExceptionHandler'
import { parseConfigForErrors } from '../src/parseConfigForErrors'
import { ErrorFormatter } from '../src/ErrorFormatter'

export default class ErrorHandlerProvider {
  constructor (public container) {}

  public async boot () {
    const Config = this.container.use('Adonis/Src/Config')
    const Server = this.container.use('Adonis/Src/Server')

    /**
     * Bind exception handler
     */
    const handler = new ExceptionHandler(Config.get('errorCodes'))
    Server.onError(handler.handle.bind(handler))

    /**
     * Parse config to ensure it's valid
     */
    parseConfigForErrors(Config.get('errorCodes'))

    /**
     * Add formatter to indicative
     */
    try {
      const { configure } = require('indicative')
      configure({ formatter: ErrorFormatter })
    } catch (error) {
      // Indicative isn't installed, so ignore the error
    }
  }
}
