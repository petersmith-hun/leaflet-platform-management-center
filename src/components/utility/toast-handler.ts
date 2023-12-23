import { ToastProperties, ToastType } from "@/components/common/OperationResultToast";
import { ErrorResponse, ValidationErrorResponse } from "@/core/model/common";
import { AxiosError } from "axios";
import { TFunction } from "i18next";
import { Dispatch, SetStateAction } from "react";

interface ToastHandler {

  /**
   * Creates a custom toast notification.
   *
   * @param title title of the toast notification
   * @param message message of the toast notification
   * @param type type (success, warning, error) of the toast notification
   */
  showCustomToast: (title: string, message: string, type?: ToastType) => void;

  /**
   * Creates a custom error toast notification (type is always error).
   *
   * @param title title of the toast notification
   * @param message message of the toast notification
   */
  showCustomErrorToast: (title: string, message: string) => void;

  /**
   * Creates a warning/error toast message based on the given AxiosError object. For HTTP 400 Bad Request responses it
   * generates a warning toast, including the validation error messages, otherwise it renders an error toast.
   *
   * @param axiosError AxiosError object
   */
  handleAxiosError: (axiosError: AxiosError) => void;
}

/**
 * Creates a toast handler for the given toast dispatcher.
 *
 * @param toastDispatcher toast dispatcher function
 * @param t translation function
 */
export const toastHandler = (toastDispatcher: Dispatch<SetStateAction<ToastProperties | null>>, t: TFunction): ToastHandler => {

  return {

    showCustomToast(title: string, message: string, type: ToastType | undefined = ToastType.SUCCESS): void {
      toastDispatcher({
        type, title, message
      })
    },

    showCustomErrorToast(title: string, message: string): void {
      toastDispatcher({
        type: ToastType.ERROR, title, message
      })
    },

    handleAxiosError(axiosError: AxiosError): void {

      if (axiosError.response?.status === 400) {
        toastDispatcher({
          type: ToastType.WARNING,
          title: t("toast.error.validation-error"),
          message: (axiosError.response?.data as ValidationErrorResponse)
            ?.validation
            ?.map(item => `${item.field}: ${item.message}`)
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
