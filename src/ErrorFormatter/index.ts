/**
 * @relayin/error-handler
 *
 * (c) Harminder Virk <harminder.virk@relay.in>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { JSONAPIErrorNode } from '../Contracts'
import { validationCodes } from '../validationCodes'

/**
 * JSONAPI spec complaint error formatter for JSON API.
 */
export class ErrorFormatter {
  public errors: JSONAPIErrorNode[] = []

  /**
   * Adds error reported by Indicative
   */
  public addError (error: Error | string, field: string, rule: string, args: any[]) {
    const message = error instanceof Error ? error.message : error
    this.errors.push({
      title: message,
      code: validationCodes[rule],
      source: { pointer: field },
      meta: {
        args,
      },
    })
  }

  /**
   * Returns an array of errors or null if errors length = 0. The `null`
   * output is part of Indicative formatters spec.
   */
  public toJSON (): null | { errors: JSONAPIErrorNode[] } {
    return this.errors.length ? { errors: this.errors } : null
  }
}
