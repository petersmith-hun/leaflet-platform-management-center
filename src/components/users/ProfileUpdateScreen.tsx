import { APIEnvironment } from "@/api-environment";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, WideDataCell } from "@/components/common/DataRow";
import { SubmitOperation } from "@/components/common/operations/SubmitOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { Input } from "@/components/form/Input";
import { Select } from "@/components/form/Select";
import { DefaultSubmitButton } from "@/components/form/SubmitButton";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { UserModel, UserProfileUpdateRequestModel } from "@/core/model/user";
import { userService } from "@/core/service/user-service";
import { faEye, faLock, faTrash } from "@fortawesome/free-solid-svg-icons";
import React, { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface ProfileUpdateScreenProps {
  environment: APIEnvironment;
  user: UserModel;
  mutate: KeyedMutator<UserModel>;
}

/**
 * Screen used by user profile update operation. Provide the user itself, as well as an SWR mutate function to
 * invalidate the cache for the edited user.
 *
 * @param environment APIEnvironment object defining the target API configuration
 * @param user user data for the editor
 * @param mutate SWR mutate function for data invalidation
 */
export const ProfileUpdateScreen = ({ environment, user, mutate }: ProfileUpdateScreenProps): ReactNode => {

  const { updateProfile } = userService(environment);
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UserProfileUpdateRequestModel>({
    defaultValues: {
      defaultLocale: user.locale,
      ...user
    }
  });
  const userID = user.id;

  return (
    <>
      <SubmitOperation domain={"user"} mutate={mutate} titleSupplier={user => user.username}
                       handleSubmit={handleSubmit}
                       serviceCall={user => updateProfile(userID, user)}>
        <MultiPaneScreen>
          <WidePane>
            <CardWithTitle title={user.username}>
              <DataRow>
                <WideDataCell>
                  <Input registerReturn={register("username", { required: t("forms:validation.common.required") })}
                         label={t("forms:user.edit.username")} id={"user-username"}
                         errorSupplier={() => errors.username?.message} />
                </WideDataCell>
                <WideDataCell>
                  <Input registerReturn={register("email", { required: t("forms:validation.common.required") })}
                         label={t("forms:user.edit.email")} id={"user-email"}
                         errorSupplier={() => errors.email?.message} />
                </WideDataCell>
              </DataRow>
              <DataRow>
                <WideDataCell>
                  <Select registerReturn={register("defaultLocale")} label={t("forms:common.edit.language")}
                          optionMap={{
                            "HU": t("forms:common.edit.language.HU"),
                            "EN": t("forms:common.edit.language.EN")
                          }} />
                </WideDataCell>
              </DataRow>
            </CardWithTitle>
          </WidePane>
          <NarrowPane>
            <PageOperationCard title={t("page-operations.account")}>
              <PageOperationButton label={t("page-operations.account.view")} icon={faEye}
                                   link={`/users/view/${userID}`} />
              <PageOperationButton label={t("page-operations.account.change-password")} icon={faLock}
                                   link={`/account/change-password`} />
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
