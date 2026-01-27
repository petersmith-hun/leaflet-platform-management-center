import environmentProperties, { APIEnvironment } from "@/api-environment";
import { PermissionComposerScreen } from "@/components/access/permission/PermissionComposerScreen";
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
 * Edit Permission page.
 * Mapped to /access/permissions/edit/:id
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function EditPermission(environment: APIEnvironment) {

  const { getPermissionByID } = permissionService(environment);
  const { t } = useTranslation();
  const { updatePageTitle } = useContext(PageContext);
  const router = useRouter();
  const { isLoading, data, error, mutate } = useSWR(swrStringKey("permissions/edit", router.query.id), key => getPermissionByID(key.parameter));

  useEffect(() => {
    updatePageTitle(t("page.title.permission.edit"));
  }, []);

  return (
    <SWRManagedScreen isLoading={isLoading} error={error}>
      {() => <PermissionComposerScreen permission={data!} environment={environment} mutate={mutate} />}
    </SWRManagedScreen>
  )
}
