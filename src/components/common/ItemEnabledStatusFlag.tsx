import { IdentifiedSelfStatusAwareModel } from "@/core/model/common";
import { faCheck, faRemove } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";

interface ItemEnabledStatusFlagProps {
  item: IdentifiedSelfStatusAwareModel;
}

/**
 * Flag component for indicating the general status of an item.
 *
 * @param item item data to extract the status of the "enabled" value
 */
export const ItemEnabledStatusFlag = ({ item }: ItemEnabledStatusFlagProps): ReactNode => {

  return item.enabled
    ? <FontAwesomeIcon className="w-10 h-10 text-success" icon={faCheck} />
    : <FontAwesomeIcon className="w-10 h-10 text-danger" icon={faRemove} />;
}
