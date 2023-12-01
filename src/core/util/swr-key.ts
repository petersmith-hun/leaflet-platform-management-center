/**
 * Cache key model for SWR operations.
 */
interface SWRKey<T> {

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
 * TODO.
 *
 * @param type
 * @param parameter
 */
export const swrKey = <T>(type: string, parameter: any): SWRKey<T> => {
  return { type, parameter: parameter as unknown as T }
}

/**
 * TODO.
 *
 * @param type
 * @param parameter
 */
export const swrNumberKey = (type: string, parameter: any): SWRKey<number> => {
  return swrKey(type, parameter);
}
