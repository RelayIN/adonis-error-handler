/**
 * @relayin/error-handler
 *
 * (c) Harminder Virk <harminder.virk@relay.in>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import * as test from 'japa'
import { ErrorFormatter } from '../src/ErrorFormatter'

test.group('Error formatter', () => {
  test('handle errors reported by indicative', (assert) => {
    const formatter = new ErrorFormatter()
    formatter.addError('Invalid value', 'username', 'required', [])

    assert.deepEqual(formatter.toJSON(), {
      errors: [{
        title: 'Invalid value',
        code: 1026,
        source: { pointer: 'username' },
        meta: {
          args: [],
        },
      }],
    })
  })

  test('keep code as undefined when code for rule is missing', (assert) => {
    const formatter = new ErrorFormatter()
    formatter.addError('Invalid value', 'username', 'pincode', ['foo'])

    assert.deepEqual(formatter.toJSON() as any, {
      errors: [{
        title: 'Invalid value',
        code: undefined,
        source: { pointer: 'username' },
        meta: {
          args: ['foo'],
        },
      }],
    })
  })
})
