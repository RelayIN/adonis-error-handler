/**
 * @relayin/error-handler
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import * as test from 'japa'
import { ErrorFormatter } from '../src/ErrorFormatter'

test.group('Error formatter', () => {
  test('handle errors reported by indicative', (assert) => {
    const formatter = new ErrorFormatter()
    formatter.addError('Invalid value', 'username', 'required')

    assert.deepEqual(formatter.toJSON(), [{
      title: 'Invalid value',
      code: 100027,
      source: { pointer: 'username' },
    }])
  })

  test('keep code as undefined when code for rule is missing', (assert) => {
    const formatter = new ErrorFormatter()
    formatter.addError('Invalid value', 'username', 'phone')

    assert.deepEqual(formatter.toJSON() as any, [{
      title: 'Invalid value',
      code: undefined,
      source: { pointer: 'username' },
    }])
  })
})
