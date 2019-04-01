/**
 * @relayin/error-handler
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { JSONAPIErrorNode } from '../Contracts'

/**
 * Validation codes for all indicative rules. Make sure to keep
 * this list updated
 */
const validationCodes = {
  above: 10001,
  accepted: 10002,
  alpha: 10003,
  alphaNumeric: 10004,
  array: 10005,
  boolean: 10006,
  confirmed: 10007,
  different: 10008,
  email: 10009,
  endsWith: 100010,
  equals: 100011,
  in: 100012,
  includes: 100013,
  integer: 100014,
  ip: 100015,
  ipv4: 100016,
  ipv6: 100017,
  json: 100018,
  max: 100019,
  min: 100020,
  notEquals: 100021,
  notIn: 100022,
  number: 100023,
  object: 100024,
  range: 100025,
  regex: 100026,
  required: 100027,
  requiredIf: 100028,
  requiredWhen: 100029,
  requiredWithAll: 100030,
  requiredWithAny: 100031,
  requiredWithoutAll: 100032,
  requiredWithoutAny: 100033,
  same: 100034,
  startsWith: 100035,
  string: 100036,
  subset: 100037,
  under: 100038,
  url: 100039,
  after: 100040,
  before: 100041,
  date: 100042,
  dateFormat: 100043,
  beforeOffsetOf: 100044,
  afterOffsetOf: 100045,
}

/**
 * JSONAPI spec complaint error formatter for JSON API.
 */
export class ErrorFormatter {
  public errors: JSONAPIErrorNode[] = []

  /**
   * Adds error reported by Indicative
   */
  public addError (error: Error | string, field: string, rule: string) {
    const message = error instanceof Error ? error.message : error
    this.errors.push({
      title: message,
      code: validationCodes[rule],
      source: { pointer: field },
    })
  }

  /**
   * Returns an array of errors or null if errors length = 0. The `null`
   * output is part of Indicative formatters spec.
   */
  public toJSON (): null | JSONAPIErrorNode[] {
    return this.errors.length ? this.errors : null
  }
}
