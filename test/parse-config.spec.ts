/**
 * @relayin/error-handler
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import * as test from 'japa'
import { ErrorHandler } from '../src/ErrorHandler'

test.group('Exception Parser', () => {
  test('raise error when errorCode referenced by an exception doesn\'t exists', (assert) => {
    const config = {
      exceptionCodes: {
        ERR_MISSING_FILE: 10001,
      },
      errorCodes: {},
      codesBucket: 1000,
    }

    const handler = new ErrorHandler(config)
    const fn = () => handler.parse()
    assert.throw(fn, 'Error code 10001 used by ERR_MISSING_FILE doesn\'t exists in list of errorCodes')
  })

  test('raise error when errorCode is below the codesBucket range', (assert) => {
    const config = {
      exceptionCodes: {
      },
      errorCodes: {
        11: {
          message: 'Invalid account',
        },
      },
      codesBucket: 1000,
    }

    const handler = new ErrorHandler(config)
    const fn = () => handler.parse()
    assert.throw(fn, 'Error code 11 must be over codesBucket range of 1000')
  })

  test('raise error when errorCode is over the codesBucket range', (assert) => {
    const config = {
      exceptionCodes: {
      },
      errorCodes: {
        2100: {
          message: 'Invalid account',
        },
      },
      codesBucket: 1000,
    }

    const handler = new ErrorHandler(config)
    const fn = () => handler.parse()
    assert.throw(fn, 'Error code 2100 must be under codesBucket range of 2000')
  })

  test('raise error when errorCode message is missing', (assert) => {
    const config = {
      exceptionCodes: {
      },
      errorCodes: {
        1001: {},
      },
      codesBucket: 1000,
    }

    const handler = new ErrorHandler(config as any)
    const fn = () => handler.parse()
    assert.throw(fn, 'Each error code inside config/errorCodes.ts must have a message')
  })

  test('raise error when error code referenced validationCodes is missing', (assert) => {
    const config = {
      exceptionCodes: {
      },
      errorCodes: {
      },
      validationCodes: {
        required: 1001,
      },
      codesBucket: 1000,
    }

    const handler = new ErrorHandler(config)
    const fn = () => handler.parse()
    assert.throw(fn, 'Error code 1001 used by required rule doesn\'t exists in list of errorCodes')
  })
})
