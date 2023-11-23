import applicationInfo from "@/application-info";
import React from "react";

/**
 * Default layout footer. Shows the application version.
 */
export const Footer = () => {

  return (
    <footer className="bg-white shadow">
      <div className="mx-auto max-w-full px-2 py-2 sm:px-6 lg:px-8">
        <h1 className="text-1xl font-bold tracking-tight text-gray-900">
          <span>{applicationInfo.abbreviation}</span>&nbsp;
          <span className="text-xs" style={{ color: "#64748b" }}>{applicationInfo.version}</span>
        </h1>
      </div>
    </footer>
  )
}
