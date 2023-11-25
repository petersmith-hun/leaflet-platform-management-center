import { AxiosResponse } from "axios";

/**
 * TODO.
 * @param response
 */
const axiosResponseHandler = <T>(response: AxiosResponse<T>): T => {

  // TODO check response status and act accordingly
  //      actually SWR can handle the GET calls, but this will still be needed for the POST calls

  return response.data;
}

export default axiosResponseHandler;