import environmentProperties, { APIEnvironment } from "@/api-environment";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { PasswordChangeScreen } from "@/components/users/PasswordChangeScreen";
import { userService } from "@/core/service/user-service";
import { swrNumberKey } from "@/core/util/swr-key";
import { useSessionHelper } from "@/hooks/use-session-helper";
import { PageContext } from "@/pages/_app";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = environmentProperties;

/**
 * Password change page for signed in user.
 * Mapped to /account/change-password
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function ChangePassword(environment: APIEnvironment) {

  const { getUserByID } = userService(environment);
  const { t } = useTranslation();
  const pageContext = useContext(PageContext);
  const { getUserInfo } = useSessionHelper();
  const {
    isLoading,
    data,
    error,
    mutate
  } = useSWR(swrNumberKey("account", getUserInfo().id), (key) => getUserByID(key.parameter));

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.account.change-password"));
  }, []);

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <PasswordChangeScreen environment={environment} user={data!} mutate={mutate} />}
    </SWRManagedScreen>
  )
}
