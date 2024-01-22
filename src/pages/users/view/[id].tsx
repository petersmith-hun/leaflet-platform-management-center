import environmentProperties, { APIEnvironment } from "@/api-environment";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { ViewUserScreen } from "@/components/users/ViewUserScreen";
import { userService } from "@/core/service/user-service";
import { swrNumberKey } from "@/core/util/swr-key";
import { PageContext } from "@/pages/_app";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = environmentProperties;

/**
 * View user details page.
 * Mapped to /user/view/:id
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function ViewUser(environment: APIEnvironment) {

  const { getUserByID } = userService(environment);
  const { t } = useTranslation();
  const pageContext = useContext(PageContext);
  const router = useRouter();
  const {
    isLoading,
    data,
    error,
    mutate
  } = useSWR(swrNumberKey("users/view", router.query.id), (key) => getUserByID(key.parameter));

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.user.view"));
  }, []);

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <ViewUserScreen environment={environment} user={data!} mutate={mutate} />}
    </SWRManagedScreen>
  )
}
