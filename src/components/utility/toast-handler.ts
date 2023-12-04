import { ToastProperties, ToastType } from "@/components/common/OperationResultToast";
import { ErrorResponse, ValidationErrorResponse } from "@/core/model/common";
import { AxiosError } from "axios";
import { TFunction } from "i18next";
import { Dispatch, SetStateAction } from "react";

interface ToastHandler {

  /**
   * TODO.
   *
   * @param title
   * @param message
   * @param type
   */
  showCustomToast: (title: string, message: string, type?: ToastType) => void;

  /**
   * TODO.
   *
   * @param title
   * @param message
   */
  showCustomErrorToast: (title: string, message: string) => void;

  /**
   * TODO.
   *
   * @param axiosError
   */
  handleAxiosError: (axiosError: AxiosError) => void;
}

/**
 * TODO.
 *
 * @param toastDispatcher
 * @param t
 */
export const toastHandler = (toastDispatcher: Dispatch<SetStateAction<ToastProperties | null>>, t: TFunction): ToastHandler => {

  return {

    showCustomToast(title: string, message: string, type: ToastType | undefined = ToastType.SUCCESS): void {
      toastDispatcher({
        type, title, message
      })
    },

    showCustomErrorToast(title: string, message: string): void {
      this.showCustomToast(title, message, ToastType.ERROR);
    },

    handleAxiosError(axiosError: AxiosError): void {

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
