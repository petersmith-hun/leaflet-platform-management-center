/**
 * Cache key model for SWR operations.
 */
export interface SWRKey<T> {

  /**
   * Arbitrary operation identifier.
   */
  type: string,

  /**
   * Actual parameter to be passed to the service.
   */
  parameter: T
}

/**
 * Creates an object that can be used as an SWR key, where the parameter can be of any type.
 *
 * @param type arbitrary request type identifier
 * @param parameter exact parameter to be passed to the service
 */
export const swrKey = <T>(type: string, parameter: any): SWRKey<T> => {
  return { type, parameter: parameter as unknown as T }
}

/**
 * Creates an object that can be used as an SWR key, where the parameter must be a number.
 *
 * @param type arbitrary request type identifier
 * @param parameter exact parameter to be passed to the service
 */
export const swrNumberKey = (type: string, parameter: any): SWRKey<number> => {
  return swrKey(type, parameter);
}

/**
 * Creates an object that can be used as an SWR key, where the parameter must be a string.
 *
 * @param type arbitrary request type identifier
 * @param parameter exact parameter to be passed to the service
 */
export const swrStringKey = (type: string, parameter: any): SWRKey<string> => {
  return swrKey(type, parameter);
}
