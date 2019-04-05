/**
 * @relayin/error-handler
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export type ErrorsConfig = {
  exceptionCodes: {
    [code: string]: number,
  },

  errorCodes: {
    [code: number]: {
      message: string,
    },
  },

  validationCodes?: {
    [rule: string]: number,
  },

  codesBucket: number,
}

export type JSONAPIErrorNode = {
  code: number,
  title: string,
  source: {
    pointer: string,
  },
  meta: {
    args: any[],
  },
}

export interface ErrorHandlerContract {
  parse (): void,
  exceptions <T extends keyof any> (): { [K in T]: K },
  handleException (error, { response }): Promise<void>,
}
