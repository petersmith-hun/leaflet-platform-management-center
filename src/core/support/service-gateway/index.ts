/**
 * Error to be thrown when an external service call fails. Must include the HTTP status code of the service call.
 */
export class ExternalServiceCallError extends Error {

  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
