import environmentProperties, { APIEnvironment } from "@/api-environment";
import { ViewPermissionScreen } from "@/components/access/permission/ViewPermissionScreen";
import { SWRManagedScreen } from "@/components/common/SWRManagedScreen";
import { permissionService } from "@/core/service/permissions-service";
import { swrStringKey } from "@/core/util/swr-key";
import { PageContext } from "@/pages/_app";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const getServerSideProps = environmentProperties;

/**
 * View permission page.
 * Mapped to /access/permissions/view/:id
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function ViewPermission(environment: APIEnvironment) {

  const { getPermissionByID } = permissionService(environment);
  const { t } = useTranslation();
  const { updatePageTitle } = useContext(PageContext);
  const router = useRouter();
  const { isLoading, data, error, mutate } = useSWR(swrStringKey("permissions/view", router.query.id), key => getPermissionByID(key.parameter));

  useEffect(() => {
    updatePageTitle(t("page.title.permission.view"));
  }, []);

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <ViewPermissionScreen permission={data!} environment={environment} mutate={mutate} />}
    </SWRManagedScreen>
  )
}
