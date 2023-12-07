import { LoadingIndicator } from "@/components/common/LoadingIndicator";
import { OperationResultToast } from "@/components/common/OperationResultToast";
import { LongRunningOperationIndicator } from "@/components/common/LongRunningOperationIndicator";
import { Footer } from "@/components/layout/sections/Footer";
import { Header } from "@/components/layout/sections/Header";
import { SideMenu } from "@/components/layout/sections/SideMenu";
import { useSessionHelper } from "@/hooks/use-session-helper";
import { PageContext } from "@/pages/_app";
import { useSession } from "next-auth/react";
import { Roboto } from "next/font/google";
import React, { useContext } from "react";

const roboto = Roboto({ weight: "400", subsets: ["latin"] });

/**
 * Default layout component for the main admin UI.
 *
 * @param children children components of the layout
 */
const DefaultLayout = ({ children }: { children: React.ReactNode }) => {

  const { status } = useSession({ required: true });
  const { getUserInfo } = useSessionHelper();
  const { toast } = useContext(PageContext);

  if (status === "loading") {
    return <LoadingIndicator />
  }

  return (
    <main className={`${roboto.className} dark min-h-screen`}>
      <LongRunningOperationIndicator />
      <Header userInfo={getUserInfo()} />
      <div className="flex flex-row grow">
        <SideMenu />
        <div className="flex flex-col grow">
          {toast && <OperationResultToast key={`alert-${new Date().getTime()}`} {...toast} />}
          <div className="max-w-full py-6 sm:px-6 lg:px-8 h-full">
            {children}
          </div>
          <Footer />
        </div>
      </div>
    </main>
  )
}

export default DefaultLayout;
