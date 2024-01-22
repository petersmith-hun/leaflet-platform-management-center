import { APIEnvironment } from "@/api-environment";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, WideDataCell } from "@/components/common/DataRow";
import { SubmitOperation } from "@/components/common/operations/SubmitOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { Input } from "@/components/form/Input";
import { DefaultSubmitButton } from "@/components/form/SubmitButton";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { PasswordChangeRequestModel, UserModel } from "@/core/model/user";
import { userService } from "@/core/service/user-service";
import { faEye, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface PasswordChangeScreenProps {
  environment: APIEnvironment;
  user: UserModel;
  mutate: KeyedMutator<UserModel>;
}

/**
 * Screen used by user password change operation.
 *
 * @param environment APIEnvironment object defining the target API configuration
 * @param user user data for the editor
 * @param mutate SWR mutate function for data invalidation
 */
export const PasswordChangeScreen = ({ environment, user, mutate }: PasswordChangeScreenProps): ReactNode => {

  const { updatePassword } = userService(environment);
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PasswordChangeRequestModel>();
  const userID = user.id;

  useEffect(() => {
    const init = async () => {
      const { Input, initTE } = await import("tw-elements");
      initTE({ Input }, { allowReinits: true });
    };
    init();
  }, []);

  return (
    <>
      <SubmitOperation domain={"user"} mutate={mutate} titleSupplier={_ => user.username}
                       handleSubmit={handleSubmit}
                       serviceCall={password => updatePassword(userID, password)}>
        <MultiPaneScreen>
          <WidePane>
            <CardWithTitle title={user.username}>
              <DataRow>
                <WideDataCell>
                  <Input
                    registerReturn={register("currentPassword", { required: t("forms:validation.common.required") })}
                    label={t("forms:user.edit.current-password")} id={"user-currentPassword"} password={true}
                    errorSupplier={() => errors.currentPassword?.message} />
                </WideDataCell>
              </DataRow>
              <DataRow>
                <WideDataCell>
                  <Input registerReturn={register("password", { required: t("forms:validation.common.required") })}
                         label={t("forms:user.edit.password")} id={"user-password"} password={true}
                         errorSupplier={() => errors.password?.message} />
                </WideDataCell>
                <WideDataCell>
                  <Input
                    registerReturn={register("passwordConfirmation", { required: t("forms:validation.common.required") })}
                    label={t("forms:user.edit.password-confirmation")} id={"user-passwordConfirmation"} password={true}
                    errorSupplier={() => errors.passwordConfirmation?.message} />
                </WideDataCell>
              </DataRow>
            </CardWithTitle>
          </WidePane>
          <NarrowPane>
            <PageOperationCard title={t("page-operations.account")}>
              <PageOperationButton label={t("page-operations.account.view")} icon={faEye}
                                   link={`/users/view/${userID}`} />
              <PageOperationButton label={t("page-operations.account.update-profile")} icon={faPencil}
                                   link={`/account/update-profile`} />
              <PageOperationButton label={t("page-operations.account.delete")} icon={faTrash}
                                   link={`/account/delete-account`} />
              <DefaultSubmitButton />
            </PageOperationCard>
          </NarrowPane>
        </MultiPaneScreen>
      </SubmitOperation>
    </>
  )
}
