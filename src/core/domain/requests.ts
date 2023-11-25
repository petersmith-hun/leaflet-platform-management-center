/**
 * TODO.
 */
export enum RequestMethod {

  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete"
}

/**
 * TODO.
 */
export class RESTRequest {

  readonly method!: RequestMethod;
  readonly path!: string;
  readonly requestBody?: unknown;
  readonly authorization?: Record<string, string>;
  readonly pathParameters?: Record<string, string | number>;
  readonly queryParameters?: Record<any, any>;
  readonly headers?: Record<string, string>;

  constructor(opts: RESTRequest) {
    Object.assign(this, {
      authorization: {},
      pathParameters: {},
      queryParameters: {},
      headers: {},
      ... opts
    });
  }
}
