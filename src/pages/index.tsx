import { PageContext } from "@/pages/_app";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * Home page component.
 */
export default function Home() {

  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  useEffect(() => {
    pageContext.updatePageTitle(t("page.title.home"));
  }, []);

  return (
    <div>
      <p>Main content placeholder</p>
    </div>
  )
}
