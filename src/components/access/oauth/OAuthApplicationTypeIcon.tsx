import { ApplicationType, OAuthApplicationSummaryModel } from "@/core/model/oauth";
import { faDesktop, faServer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface ApplicationTypeIconProps {
  item: OAuthApplicationSummaryModel;
}

/**
 * Flag component for indicating the general status of an item.
 *
 * @param item item data to extract the status of the "enabled" value
 */
export const OAuthApplicationTypeIcon = ({ item }: ApplicationTypeIconProps): ReactNode => {

  const { t } = useTranslation();

  return item.applicationType == ApplicationType.UI
    ? <FontAwesomeIcon className="w-10 h-10" icon={faDesktop} title={t("oauth-application.label.type.ui")} />
    : <FontAwesomeIcon className="w-10 h-10" icon={faServer} title={t("oauth-application.label.type.service")} />;
}
