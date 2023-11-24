import applicationInfo from "@/application-info";
import DefaultLayout from "@/components/layout/DefaultLayout";
import "@/i18n";
import "@/styles/custom.css";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from 'next/app'
import Head from "next/head";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "tw-elements/dist/css/tw-elements.min.css";

type PageContextOperations = {

  /**
   * Retrieves the title set for the current screen.
   */
  pageTitle: string;

  /**
   * Updates the title for the current screen.
   *
   * @param pageTitle page title to be set
   */
  updatePageTitle: (pageTitle: string) => void
};

interface PageData {
  title: string;
}

/**
 * React Context object for handling the screens' title.
 */
export const PageContext = React.createContext<PageContextOperations>({
  pageTitle: "",
  updatePageTitle: (_: string): void => {}
});

/**
 * React application entry point. Adds the following default functionalities:
 *  - SessionProvider: provides access to the user session
 *  - PageContext.Provider: stores the current screen's title and lets the specific screens change their own title
 *  - DefaultLayout: adds the DefaultLayout component as a wrapper around every page
 *
 * @param Component page component object
 * @param session user session
 * @param pageProps additional page properties
 */
export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {

  const { t } = useTranslation();
  const [pageData, setPageData] = useState<PageData>({ title: t("page.title.default") });

  return (
    <SessionProvider session={session}>
      <PageContext.Provider
        value={{
          pageTitle: pageData.title,
          updatePageTitle: (title: string) => setPageData({ ...pageData, title: title })
        }}>
        <DefaultLayout>
          <Head>
            <title>{applicationInfo.applicationName}</title>
          </Head>
          <Component {...pageProps} />
        </DefaultLayout>
      </PageContext.Provider>
    </SessionProvider>
  )
}
