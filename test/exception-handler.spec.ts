/**
 * @relay/error-handler
 *
 * (c) Harminder Virk <harminder.virk@relay.in>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import * as test from 'japa'
import { ExceptionManager } from '../src/ExceptionManager'

test.group('ExceptionHandler', () => {
  test('build error object from config', async (assert) => {
    const error = new Error('Invalid account') as NodeJS.ErrnoException
    error.code = 'E_INVALID_ACCOUNT'

    const config = {
      exceptionCodes: {
        E_INVALID_ACCOUNT: 10001,
      },

      errorCodes: {
        10001: {
          message: 'Your account is not in active state',
        },
      },

      codesBucket: 10000,
    }

    const handler = new ExceptionManager(config)
    assert.deepEqual(handler.toResponse(error), {
      status: 500,
      errors: [{
        title: 'Your account is not in active state',
        code: 10001,
      }],
    })
  })

  test('use status code from the error property', async (assert) => {
    const error = new Error('Invalid account') as NodeJS.ErrnoException
    error.code = 'E_INVALID_ACCOUNT'
    error['status'] = 400

    const config = {
      exceptionCodes: {
        E_INVALID_ACCOUNT: 10001,
      },

      errorCodes: {
        10001: {
          message: 'Your account is not in active state',
        },
      },

      codesBucket: 10000,
    }

    const handler = new ExceptionManager(config)

    assert.deepEqual(handler.toResponse(error), {
      status: 400,
      errors: [{
        title: 'Your account is not in active state',
        code: 10001,
      }],
    })
  })

  test('use generic message and code when config for error code is missing', async (assert) => {
    const error = new Error('Invalid account') as NodeJS.ErrnoException
    error.code = 'E_INVALID_ACCOUNT'
    error['status'] = 400

    const config = {
      exceptionCodes: {
      },

      errorCodes: {
      },

      codesBucket: 10000,
    }

    const handler = new ExceptionManager(config)
    assert.deepEqual(handler.toResponse(error), {
      status: 400,
      errors: [{
        title: 'Unable to process request',
        code: 1000,
      }],
    })
  })
})
