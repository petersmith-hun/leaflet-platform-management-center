import environmentProperties, { APIEnvironment } from "@/api-environment";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { AccountDeletionScreen } from "@/components/users/AccountDeletionScreen";
import { userService } from "@/core/service/user-service";
import { swrNumberKey } from "@/core/util/swr-key";
import { useSessionHelper } from "@/hooks/use-session-helper";
import { PageContext } from "@/pages/_app";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = environmentProperties;

/**
 * Account deletion page for signed in user.
 * Mapped to /account/delete-account
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function DeleteAccount(environment: APIEnvironment) {

  const { getUserByID } = userService(environment);
  const { t } = useTranslation();
  const pageContext = useContext(PageContext);
  const { getUserInfo } = useSessionHelper();
  const {
    isLoading,
    data,
    error
  } = useSWR(swrNumberKey("account", getUserInfo().id), (key) => getUserByID(key.parameter));

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.account.delete-account"));
  }, []);

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <AccountDeletionScreen environment={environment} user={data!} />}
    </SWRManagedScreen>
  )
}
