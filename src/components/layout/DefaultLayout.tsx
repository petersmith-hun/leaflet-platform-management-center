import { LoadingIndicator } from "@/components/common/LoadingIndicator";
import { Footer } from "@/components/layout/sections/Footer";
import { Header } from "@/components/layout/sections/Header";
import { SideMenu } from "@/components/layout/sections/SideMenu";
import { useSessionHelper } from "@/hooks/use-session-helper";
import { useSession } from "next-auth/react";
import { Roboto } from "next/font/google";
import React from "react";

const roboto = Roboto({ weight: "400", subsets: ["latin"] });

/**
 * Default layout component for the main admin UI.
 *
 * @param children children components of the layout
 */
const DefaultLayout = ({ children }: { children: React.ReactNode }) => {

  const { status } = useSession({ required: true });
  const { getUserInfo } = useSessionHelper();

  if (status === "loading") {
    return <LoadingIndicator />
  }

  return (
    <main className={`${roboto.className} dark min-h-screen`}>
      <Header userInfo={getUserInfo()} />
      <div className="flex flex-row grow">
        <SideMenu />
        <div className="flex flex-col grow">
          <div className="max-w-7xl py-6 sm:px-6 lg:px-8 h-full">
            {children}
          </div>
          <Footer />
        </div>
      </div>
    </main>
  )
}

export default DefaultLayout;
