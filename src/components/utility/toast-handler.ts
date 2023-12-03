import { ToastProperties, ToastType } from "@/components/common/OperationResultToast";
import { ErrorResponse, ValidationErrorResponse } from "@/core/model/common";
import { AxiosError } from "axios";
import { TFunction } from "i18next";
import { Dispatch, SetStateAction } from "react";

interface ToastHandler {

  /**
   * TODO.
   *
   * @param axiosError
   */
  handleErrorResponse: (axiosError: AxiosError) => void;
}

/**
 * TODO.
 *
 * @param toastDispatcher
 * @param t
 */
export const toastHandler = (toastDispatcher: Dispatch<SetStateAction<ToastProperties | null>>, t: TFunction): ToastHandler => {

  return {
    handleErrorResponse(axiosError: AxiosError): void {

      if (axiosError.response?.status === 400) {
        toastDispatcher({
          type: ToastType.WARNING,
          title: t("toast.error.validation-error"),
          message: (axiosError.response?.data as ValidationErrorResponse)
            ?.validation
            .map(item => `${item.field}: ${item.message}`)
        })
      } else {
        toastDispatcher({
          type: ToastType.ERROR,
          title: t("toast.error.unknown-error"),
          message: (axiosError.response?.data as ErrorResponse).message
        })
      }
    }
  }
}
