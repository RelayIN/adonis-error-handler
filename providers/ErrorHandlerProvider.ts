/**
 * @relayin/error-handler
 *
 * (c) Harminder Virk <harminder.virk@relay.in>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ExceptionManager } from '../src/ExceptionManager'
import { ErrorFormatter } from '../src/ErrorFormatter'

export default class ErrorHandlerProvider {
  constructor (protected container) {}

  /**
   * Register `Relay/ErrorHandler` to the container. We don't
   * need a new instance for handler everytime, so binding
   * a singleton is the way to go
   */
  public register () {
    this.container.singleton('Relay/ErrorHandler', () => {
      const Config = this.container.use('Adonis/Src/Config')
      return new ExceptionManager(Config.get('errorCodes'))
    })
  }

  public async boot () {
    const handler = this.container.use('Relay/ErrorHandler')

    /**
     * Parse config and report errors (if any)
     */
    handler.parse()

    /**
     * Add formatter to indicative
     */
    try {
      const { configure } = require('indicative')

      /**
       * Define custom formatter
       */
      configure({ formatter: ErrorFormatter })
    } catch (error) {
      // Indicative isn't installed, so ignore the error
    }
  }
}
