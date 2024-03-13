import { APIEnvironment } from "@/api-environment";
import { CardWithTitle, PageOperationCard, SimpleCard } from "@/components/common/Cards";
import { DataRow, WideDataCell } from "@/components/common/DataRow";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { Input } from "@/components/form/Input";
import { SubmitButton } from "@/components/form/SubmitButton";
import { AwarenessLevel } from "@/components/navigation/OperationButton";
import { toastHandler } from "@/components/utility/toast-handler";
import { AccountDeletionRequestModel, UserModel } from "@/core/model/user";
import { userService } from "@/core/service/user-service";
import { useSessionHelper } from "@/hooks/use-session-helper";
import { PageContext } from "@/pages/_app";
import { faTrash, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut } from "next-auth/react";
import React, { ReactNode, useContext } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface AccountDeletionScreenProps {
  environment: APIEnvironment;
  user: UserModel;
}

/**
 * Screen used by user account deletion operation.
 *
 * @param environment APIEnvironment object defining the target API configuration
 * @param user user data for the editor
 */
export const AccountDeletionScreen = ({ environment, user }: AccountDeletionScreenProps): ReactNode => {

  const { deleteUserByID } = userService(environment);
  const { t } = useTranslation();
  const { getUserInfo } = useSessionHelper();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AccountDeletionRequestModel>();
  const { triggerToast, setOperationInProgress } = useContext(PageContext);
  const { handleAxiosError } = toastHandler(triggerToast, t);

  const handleDeletion = (): void => {

    setOperationInProgress(true);
    deleteUserByID(getUserInfo().id)
      .then(_ => signOut())
      .catch(handleAxiosError)
      .finally(() => setOperationInProgress(false));
  }

  return (
    <form onSubmit={handleSubmit(handleDeletion)}>
      <MultiPaneScreen>
        <WidePane>
          <SimpleCard>
            <p className="text-danger">
              <FontAwesomeIcon className="h-6 w-6" icon={faWarning} /> {t("account.label.account-deletion-warning")}
            </p>
          </SimpleCard>
        </WidePane>
      </MultiPaneScreen>
      <MultiPaneScreen>
        <WidePane>
          <CardWithTitle title={user.username}>
            <DataRow>
              <WideDataCell>
                <Input
                  registerReturn={register("email", {
                    required: t("forms:validation.common.required"),
                    validate: value => value === getUserInfo().email || t("account.label.delete-email-mismatch")
                  })}
                  label={t("forms:user.edit.type-email-to-proceed")} id={"user-email"}
                  errorSupplier={() => errors.email?.message} />
              </WideDataCell>
            </DataRow>
          </CardWithTitle>
        </WidePane>
        <NarrowPane>
          <PageOperationCard title={t("page-operations.account")}>
            <SubmitButton label={t("page-operations.account.confirm-delete-account")} icon={faTrash}
                          awareness={AwarenessLevel.ALERT} />
          </PageOperationCard>
        </NarrowPane>
      </MultiPaneScreen>
    </form>
  )
}
