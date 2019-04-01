# @relayin/error-handler
> Errors management at relay

![](https://img.shields.io/circleci/project/github/RelayIN/error-handler/develop.svg?style=flat-square)
![](https://img.shields.io/badge/Uses-Typescript-294E80.svg?style=flat-square&colorA=ddd)

Relay error handler is a package used by Node.js micro services to return consistent error nodes from the API response.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of contents

- [Types of errors/exceptions](#types-of-errorsexceptions)
  - [Validation errors](#validation-errors)
  - [Flow exceptions](#flow-exceptions)
  - [Unexcepted exceptions](#unexcepted-exceptions)
- [How do we handle them?](#how-do-we-handle-them)
- [Shape of error objects](#shape-of-error-objects)
- [Usage](#usage)
- [Defining codes for exceptions](#defining-codes-for-exceptions)
- [Change log](#change-log)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Types of errors/exceptions

Before getting started, let's distinguish between the types of error an application can have and why having a consistent output is important.

### Validation errors
Validation errors are the most straight forward one's. The service validates the user input and returns one or more errors, when the incoming data is not valid.

We make use of [indicative](https://indicative.adonisjs.com) for running data validations. Indicative offers an API to define error formatters, can be used to re-shape the errors array.

This module `(relayin/error-handler)` configures a custom error formatter with Indicative to have a consistent validation error nodes.

### Flow exceptions
The flow exceptions occurs, when a backend service peforms inline checks before taking certain actions. Notice we make use keyword `exception` and not `error`. Their is a slight difference between error and exception. For example:

A client makes a request to one of our service and we notice that their account is invalid. At first place, they shouldn't be able to make this request with an invalid account.

Flow exceptions occurs when a request reaches a guard intentionally added for extra security.

### Unexcepted exceptions
As the name says, unexpected exceptions are unanticipated exceptions that must be handled gracefully and logged to the system for further inspection.

## How do we handle them?
At relay, we make sure to uniquely identify an error or exception with a numeric code like `10001`. The numeric codes are inspired from [twilio](https://www.twilio.com/docs/verify/return-and-error-codes) and has following benefits.

1. You don't have to think hard for unique names. Simply increment the error and write documentation for it.
2. It's easier to have unique code per micro service. Assign a numeric bucket like **1000 to auth** and **2000 to directory** and so on.

The numeric codes not only makes it easier to identify the error. It gives freedom to the clients to display error messages in the user language by mapping them against the code.

## Shape of error objects
The shape of error objects is driven by [jsonapi spec](https://jsonapi.org/format/#errors) and looks as follows.

```js
{
  code: 10001,
  title: 'Generic error message title in english',
  source: {
    pointer: 'data/field/reference',
  },
}
```

The `source` object will be removed when error is not related to a field.

```js
{
  code: 10002,
  title: 'Inactive account',
}
```

## Usage
Finally let's jump on the usage of this module. It automatically configures an [exception handler](https://adonisjs.com/docs/4.0/exceptions) for AdonisJs and a [error formatter](https://indicative.adonisjs.com/docs/formatters) for Indicative.

Install it from npm as follows:

```bash
npm i @relayin/error-handler
```

and then use it as a service provider inside `start/app.ts` file.

```ts
export const providers = [
  '@relayin/error-handler/build/providers/ErrorHandlerProvider'
]
```

That's all from the usage point of view. The validation errors gets a unique set of error codes, which are shared by all micro service and you won't have to do much on that front.

## Defining codes for exceptions
For exceptions, you need to create a config file `config/errorCodes.ts` and define codes for them.

```ts
export const exceptionCodes = {
  ERR_GATEWAY_FAILURE: 20001,
  ERR_MISSING_OTP: 20001,
  ERR_INVALID_OTP_LENGTH: 20001,
  ERR_MISSING_MOBILE_NUMBER: 20001,
  ERR_UNKNOWN_GATEWAY_FAILURE: 20001,
}

export const errorCodes = {
  20001: {
    message: 'Unable to send SMS. Try again after some time'
  },
}

export const codesBucket = 20000
```

Following is the explaination for the config file.

- **exceptionCodes**: Exception codes are logged to the logging service. They are used for debugging and should never be exposed to the client.
- **errorCodes**: The `errorCodes` is the list of codes and their generic messages, you want to return to the client. It is possible that for multiple exceptions you want to return a generic code to the client, sicne they don't take if sending SMS failed coz of `E_GATEWAY_FAILURE` or `E_INVALID_API_KEY`.
- **codesBucket**: The bucket ensures that you always use numeric codes within the range of your bucket and avoid conflicts with micro services.

## Change log
The changelog can be found in the [CHANGELOG.md](CHANGELOG.md) file.

