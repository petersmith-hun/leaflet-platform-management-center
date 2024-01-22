import environmentProperties, { APIEnvironment } from "@/api-environment";
import { UserListScreen } from "@/components/users/UserListScreen";
import { PageContext } from "@/pages/_app";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const getServerSideProps = environmentProperties;

/**
 * User manager main page.
 * Mapped to /users
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export default function Users(environment: APIEnvironment) {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.users"));
  }, []);

  return <UserListScreen environment={environment} />
}
