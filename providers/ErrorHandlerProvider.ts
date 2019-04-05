/**
 * @relayin/error-handler
 *
 * (c) Harminder Virk <harminder.virk@relay.in>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ErrorHandler } from '../src/ErrorHandler'
const INDIAN_NUMBER_REGEX = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/

export default class ErrorHandlerProvider {
  constructor (public container) {}

  /**
   * Register `Relay/ErrorHandler` to the container. We don't
   * need a new instance for handler everytime, so binding
   * a singleton is the way to go
   */
  public register () {
    this.container.singleton('Relay/ErrorHandler', () => {
      const Config = this.container.use('Adonis/Src/Config')
      return new ErrorHandler(Config.get('errorCodes'))
    })
  }

  public async boot () {
    const handler = this.container.use('Relay/ErrorHandler')
    const Server = this.container.use('Adonis/Src/Server')

    /**
     * Handle exceptions
     */
    Server.onError(handler.handleException.bind(handler))

    /**
     * Parse config and report errors (if any)
     */
    handler.parse()

    /**
     * Add formatter to indicative
     */
    try {
      const { configure, extend, utils } = require('indicative')

      /**
       * Define custom formatter
       */
      configure({ formatter: handler.getFormatter() })

      /**
       * Extend indicative to add `phone` number
       */
      extend('phone', {
        async: false,
        validate: (data, field, _args, _type, _root, config: any): boolean => {
          const fieldValue = data[field]

          if (utils.skippable(fieldValue, field, config)) {
            return true
          }

          return INDIAN_NUMBER_REGEX.test(fieldValue)
        },
      })
    } catch (error) {
      // Indicative isn't installed, so ignore the error
    }
  }
}
