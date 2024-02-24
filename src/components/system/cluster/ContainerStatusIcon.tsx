import { ContainerStatus, ContainerView } from "@/core/model/cluster";
import {
  faCircleQuestion,
  faPauseCircle,
  faPlayCircle,
  faPlusCircle,
  faRotateLeft,
  faSkull,
  faStopCircle,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";

const iconDefinitionMap = new Map<ContainerStatus, IconDefinition>([
  [ContainerStatus.CREATED, faPlusCircle],
  [ContainerStatus.RUNNING, faPlayCircle],
  [ContainerStatus.PAUSED, faPauseCircle],
  [ContainerStatus.RESTARTING, faRotateLeft],
  [ContainerStatus.EXITED, faStopCircle],
  [ContainerStatus.DEAD, faSkull],
]);

type AwarenessClass = "text-success" | "text-warning" | "text-danger";

const awarenessClassMap = new Map<ContainerStatus, AwarenessClass>([
  [ContainerStatus.RUNNING, "text-success"],
  [ContainerStatus.EXITED, "text-danger"],
  [ContainerStatus.DEAD, "text-danger"],
]);

interface ContainerStatusIconProps {
  containerView: ContainerView;
}

/**
 * Renders the relevant status icon for a given container, based on its runtime status.
 *
 * @param containerView contains the details of the given container
 */
export const ContainerStatusIcon = ({ containerView }: ContainerStatusIconProps): ReactNode => {

  let statusIconDefinition = iconDefinitionMap.get(containerView.status) ?? faCircleQuestion;
  let awarenessClass = awarenessClassMap.get(containerView.status) ?? "text-warning";

  return <FontAwesomeIcon icon={statusIconDefinition} className={`w-[90px] h-[90px] ${awarenessClass}`} />
}
