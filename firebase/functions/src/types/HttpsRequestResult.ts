import { logger } from 'firebase-functions';
import { StatusCodes } from 'http-status-codes';
import { Operation } from './Operation';
import { Response } from 'firebase-functions/v1';

/**
 * This class simplifies tracking operations and writing the status and response body.
 *
 * This class is designed to be used with OperationResult. The idea is that all top-level cloud
 * functions should validate their inputs, rates, etc, and then make function calls awaiting a
 * promise for an OperationResult.
 *
 * Those functions can in turn make additional operation calls, aggregating the sub ops.
 * This keeps business logic separate from the HTTP handler and provides a nice paper trail
 * of the results of each operation.
 *
 * Unhandled promise rejections should be caught at the top level and the status set to
 * `StatusCodes.INTERNAL_SERVER_ERROR`.
 */
export class HttpsRequestResult {
  public status: number;
  public success: boolean;
  public error?: string;
  public ops: Operation[];
  public value?: string;

  constructor() {
    this.status = StatusCodes.OK;
    this.success = true;
    this.ops = [];
  }

  public addOp(op: Operation): void {
    this.ops.push(op);
  }

  /**
   * Sets the status code for the response and sends the results as a JSON string in the response body.
   * @param response The HTTP response for the Google function.
   * @returns The HTTP response object that was provided.
   */
  public send(response: Response<any>): Response<any> {
    const responseBody = {
      status: this.status,
      success: this.success,
      error: this.error,
      operation: this.ops,
      value: this.value,
    };

    let responseBodyString = '{}';
    try {
      responseBodyString = JSON.stringify(responseBody);
    } catch (error) {
      logger.error(error);
    }

    return response.status(this.status).send(responseBodyString);
  }
}
