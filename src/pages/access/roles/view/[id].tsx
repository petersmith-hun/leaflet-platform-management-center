import environmentProperties, { APIEnvironment } from "@/api-environment";
import { ViewRoleScreen } from "@/components/access/role/ViewRoleScreen";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { roleService } from "@/core/service/roles-service";
import { swrStringKey } from "@/core/util/swr-key";
import { PageContext } from "@/pages/_app";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = environmentProperties;

/**
 * View role page.
 * Mapped to /access/roles/view/:id
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function ViewRole(environment: APIEnvironment) {

  const { getRoleByID } = roleService(environment);
  const { t } = useTranslation();
  const { updatePageTitle } = useContext(PageContext);
  const router = useRouter();
  const { isLoading, data, error, mutate } = useSWR(swrStringKey("roles/view", router.query.id), key => getRoleByID(key.parameter));

  useEffect(() => {
    updatePageTitle(t("page.title.role.view"));
  }, []);

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <ViewRoleScreen role={data!} environment={environment} mutate={mutate} />}
    </SWRManagedScreen>
  )
}
