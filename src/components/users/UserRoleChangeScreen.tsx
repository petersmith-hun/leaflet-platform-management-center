import { APIEnvironment } from "@/api-environment";
import { CardWithTitle, PageOperationCard, SimpleCard } from "@/components/common/Cards";
import { DataRow, WideDataCell } from "@/components/common/DataRow";
import { InlineLoadingIndicator } from "@/components/common/InlineLoadingIndicator";
import { SubmitOperation } from "@/components/common/operations/SubmitOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { DefaultSubmitButton } from "@/components/form/SubmitButton";
import { PageOperationButton } from "@/components/navigation/OperationButton";
import { RoleSelector } from "@/components/users/RoleSelector";
import { RoleModel } from "@/core/model/role";
import { AccountType, UserModel, UserRoleUpdateRequestModel } from "@/core/model/user";
import { roleService } from "@/core/service/roles-service";
import { userService } from "@/core/service/user-service";
import { swrKey } from "@/core/util/swr-key";
import { faArrowCircleRight, faEye, faList, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useSWR, { KeyedMutator } from "swr";

interface UserRoleChangeScreenProps {
  environment: APIEnvironment;
  user: UserModel;
  mutate: KeyedMutator<UserModel>;
}

interface RoleChangeFormProps {
  user: UserModel;
  registerReturn: UseFormRegisterReturn<"roleID">;
  roles: RoleModel[];
}

const RoleChangeForm = ({ user, registerReturn, roles }: RoleChangeFormProps): ReactNode => {

  return (
    <CardWithTitle title={`${user.username} (${user.email})`}>
      <DataRow>
        <WideDataCell>
          <div className="flex flex-row">
            <div className="w-11/12">
              <p>{user.role.name}</p>
              <span className="block text-[0.8rem] text-gray-500 dark:text-gray-300">{user.role.description}</span>
            </div>
            <div className="pt-3">
              <span><FontAwesomeIcon className="h-6 w-6" icon={faArrowCircleRight} /></span>
            </div>
          </div>
        </WideDataCell>
        <WideDataCell>
          <div className="pt-2">
            <RoleSelector registerReturn={registerReturn} roles={roles} />
          </div>
        </WideDataCell>
      </DataRow>
    </CardWithTitle>
  )
}

const ExternalUserNotification = (): ReactNode => {

  const { t } = useTranslation();

  return (
    <SimpleCard>
      <p className="text-warning">
        <FontAwesomeIcon className="h-6 w-6" icon={faWarning} /> {t("user.label.external-user-role-locked")}
      </p>
    </SimpleCard>
  )
}

/**
 * Screen component to change a user's role.
 *
 * @param user data of an existing user
 * @param environment APIEnvironment object defining the target API configuration
 * @param mutate SWR mutate function for data invalidation
 */
export const UserRoleChangeScreen = ({ environment, user, mutate }: UserRoleChangeScreenProps): ReactNode => {

  const { updateRole } = userService(environment);
  const { getAllRoles } = roleService(environment);
  const { t } = useTranslation();
  const { data: roles, isLoading: rolesLoading } = useSWR(swrKey("roles", "all"), getAllRoles);
  const { register, handleSubmit } = useForm<UserRoleUpdateRequestModel>({
    defaultValues: { roleID: user.role.id }
  });

  if (rolesLoading) {
    return <InlineLoadingIndicator />;
  }

  return (
    <SubmitOperation domain={"user"} mutate={mutate} titleSupplier={_ => user.username}
                     handleSubmit={handleSubmit}
                     serviceCall={role => updateRole(user.id, role)}>
      <MultiPaneScreen>
        <WidePane>
          {user.accountType === AccountType.LOCAL
            ? <RoleChangeForm user={user} registerReturn={register("roleID")} roles={roles?.content ?? []} />
            : <ExternalUserNotification />
          }
        </WidePane>
        <NarrowPane>
          <PageOperationCard title={t("page-operations.user")}>
            <PageOperationButton label={t("page-operations.user.view")} icon={faEye} link={`/users/view/${user.id}`} />
            <PageOperationButton label={t("page-operations.user.back-to-users")} icon={faList} link={"/users"} />
            <DefaultSubmitButton />
          </PageOperationCard>
        </NarrowPane>
      </MultiPaneScreen>
    </SubmitOperation>
  )
}
