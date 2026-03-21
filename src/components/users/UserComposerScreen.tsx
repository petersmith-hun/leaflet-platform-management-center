import { APIEnvironment } from "@/api-environment";
import { CardWithTitle, PageOperationCard, SimpleCard } from "@/components/common/Cards";
import { DataRow, WideDataCell } from "@/components/common/DataRow";
import { InlineLoadingIndicator } from "@/components/common/InlineLoadingIndicator";
import { SubmitOperation } from "@/components/common/operations/SubmitOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { Input } from "@/components/form/Input";
import { Select } from "@/components/form/Select";
import { DefaultSubmitButton } from "@/components/form/SubmitButton";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { RoleSelector } from "@/components/users/RoleSelector";
import { UserCreationRequestModel, UserModel } from "@/core/model/user";
import { roleService } from "@/core/service/roles-service";
import { userService } from "@/core/service/user-service";
import { swrKey } from "@/core/util/swr-key";
import { faList, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useSWR, { KeyedMutator } from "swr";

interface UserComposerScreenProps {
  environment: APIEnvironment;
  mutate?: KeyedMutator<UserModel>;
}

const PasswordResetNotification = (): ReactNode => {

  const { t } = useTranslation();

  return (
    <MultiPaneScreen>
      <WidePane>
        <SimpleCard>
          <p className="text-warning">
            <FontAwesomeIcon className="h-6 w-6" icon={faWarning} /> {t("user.label.notification-change-password")}
          </p>
        </SimpleCard>
      </WidePane>
    </MultiPaneScreen>
  )
}

/**
 * Screen used by user manager's create operation.
 *
 * @param environment APIEnvironment object defining the target API configuration
 * @param mutate SWR mutate function for data invalidation
 */
export const UserComposerScreen = ({ environment, mutate }: UserComposerScreenProps): ReactNode => {

  const { createUser } = userService(environment);
  const { getAllRoles } = roleService(environment);
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<UserCreationRequestModel>();
  const { data: roles, isLoading: rolesLoading } = useSWR(swrKey("roles", "all"), getAllRoles);

  if (rolesLoading) {
    return <InlineLoadingIndicator />;
  }

  return (
    <>
      <PasswordResetNotification />
      <SubmitOperation domain={"user"} mutate={mutate} titleSupplier={user => user.username}
                       handleSubmit={handleSubmit}
                       serviceCall={user => createUser(user)}>
        <MultiPaneScreen>
          <WidePane>
            <CardWithTitle title={t("page.title.user.create")}>
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
                  <RoleSelector registerReturn={register("roleID")} roles={roles?.content ?? []} />
                </WideDataCell>
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
            <PageOperationCard title={t("page-operations.user")}>
              <PageOperationButton label={t("page-operations.user.back-to-users")} icon={faList}
                                   link={"/users"} />
              <DefaultSubmitButton />
            </PageOperationCard>
          </NarrowPane>
        </MultiPaneScreen>
      </SubmitOperation>
    </>
  )
}
