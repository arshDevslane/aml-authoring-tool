import { ErrorInfo } from 'react';

/**
 * The function logs an error and component stack information to the console.
 * @param {Error} error - The error parameter is an instance of the Error class that represents an
 * error that occurred during the execution of the code.
 * @param info - The `info` parameter is an object that contains information about the component stack
 * where the error occurred. It has a single property `componentStack` which is a string that
 * represents the call stack of the component hierarchy at the time the error was thrown. This
 * information can be useful in debugging and identifying the issue
 */
export function errorBoundaryHelper(error: Error, info: ErrorInfo) {
  console.error({ error });
  console.info({ info });
}
