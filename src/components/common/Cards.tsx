import { ResizeBlockButton } from "@/components/common/ResizeBlockButton";
import { Separator } from "@/components/common/Separator";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";

interface SimpleCardProps {
  children: ReactNode;
}

interface PageOperationCardProps extends SimpleCardProps {
  title: string;
}

interface CardWithTitleProps extends PageOperationCardProps {
  icon?: IconDefinition;
  resizable?: string;
}

/**
 * Renders a TW-Elements Card component.
 *
 * @param children contents to be rendered within
 */
export const SimpleCard = ({ children }: SimpleCardProps) => {

  return (
    <div
      className="block w-full mb-3 rounded-lg bg-white text-left shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}

/**
 * Renders a TW-Elements Card component for entity lists.
 *
 * @param children contents to be rendered within
 */
export const ItemListCard = ({ children }: SimpleCardProps) => {

  return (
    <div
      className="rounded-lg bg-white p-6 mb-3 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:shadow-lg dark:bg-neutral-700 flex md:flex-row flex-col">
      {children}
    </div>
  )
}

/**
 * Renders a TW-Element Card component, including an H2 heading. Also, able to render a resize button within the heading,
 * if a target container's ID is provided.
 *
 * @param children contents to be rendered within
 * @param title title of the card
 * @param resizable adds a resize button to the card
 * @param icon optional icon to be put before the title
 */
export const CardWithTitle = ({ children, title, resizable, icon }: CardWithTitleProps) => {

  return (
    <SimpleCard>
      <h2 className="mb-2 mt-0 text-xl font-medium leading-tight text-primary-200 clear-both">
        {icon && <FontAwesomeIcon icon={icon} />} {title}
        {resizable && <ResizeBlockButton resizableContainerID={resizable} />}
      </h2>
      <Separator thick={false} />
      {children}
    </SimpleCard>
  )
}

/**
 * Renders a narrow TW-Element Card component, to be used as a page operation block. Contents of this component are
 * rendered in a column using flex-col directive.
 *
 * @param children contents to be rendered within
 * @param title title of the card
 */
export const PageOperationCard = ({ children, title }: PageOperationCardProps) => {

  return (
    <CardWithTitle title={title}>
      <div className="flex flex-col">
        {children}
      </div>
    </CardWithTitle>
  )
}
