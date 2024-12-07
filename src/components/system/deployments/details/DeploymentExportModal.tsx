import { Modal } from "@/components/common/Modal";
import { AwarenessLevel } from "@/components/navigation/OperationButton";
import { faCheck, faCopy, faFileExport, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dynamic from "next/dynamic";
import React, { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";

interface DeploymentExportModalProps {
  exportedDeployment: string;
}

interface LocalPageOperationButtonProperties {
  onClick: () => void;
}

interface CopyYAMLButtonProperties {
  label: string;
  icon: IconDefinition;
  onClick: () => void;
  id: string;
  awareness?: AwarenessLevel;
}

const CopyYAMLButton = ({ label, icon, onClick, awareness = AwarenessLevel.NORMAL }: CopyYAMLButtonProperties): ReactNode => {

  return (
    <div className="mb-3 w-full flex flex-col items-end">
      <button type="button"
              className={`${awareness} text-left inline-block w-3/12 rounded border-2 px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary-100 transition duration-150 ease-in-out hover:border-primary-accent-100 hover:bg-neutral-500 hover:bg-opacity-10 focus:border-primary-accent-100 focus:outline-none focus:ring-0 active:border-primary-accent-200 dark:text-primary-100 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10`}
              onClick={onClick}>
        <FontAwesomeIcon className="w-4 h-4 mr-2" icon={icon} /> {label}
      </button>
    </div>
  )
}

const copyYAML = (yaml: string, setCopied?: Dispatch<SetStateAction<boolean>>): void => {

  navigator.clipboard.writeText(yaml)
    .then(() => setCopied && setCopied(true));
}

/**
 * Renders a button to trigger exporting the currently viewed deployment definition as YAML document.
 *
 * @param onClick click listener function
 */
export const ExportDeploymentButton = ({ onClick }: LocalPageOperationButtonProperties): ReactNode => {

  const { t } = useTranslation();

  return (
    <div className="mb-3">
      <button type="button"
              data-te-toggle="modal"
              data-te-target="#deployment-definition-yaml"
              className={`${AwarenessLevel.POSITIVE} text-left inline-block w-full rounded border-2 px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary-100 transition duration-150 ease-in-out hover:border-primary-accent-100 hover:bg-neutral-500 hover:bg-opacity-10 focus:border-primary-accent-100 focus:outline-none focus:ring-0 active:border-primary-accent-200 dark:text-primary-100 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10`}
              onClick={onClick}>
        <FontAwesomeIcon className="w-4 h-4 mr-2" icon={faFileExport} /> {t("page-operations.deployment.export")}
      </button>
    </div>
  )
}

/**
 * Renders a modal window showing the exported deployment definition as YAML document.
 *
 * @param exportedDeployment deployment definition content as YAML-formatted string
 */
export const DeploymentExportModal = ({ exportedDeployment }: DeploymentExportModalProps): ReactNode => {

  const { t } = useTranslation();
  const MonacoEditor = dynamic(import("@monaco-editor/react"), { ssr: false });
  const [copied, setCopied] = useState(false);

  return (
    <Modal id={"deployment-definition-yaml"} title={t("modal.title.deployment-definition-yaml")}>
      {!copied && <CopyYAMLButton awareness={AwarenessLevel.POSITIVE} id={"file-copy-reference"}
                                  label={t("page-operations.deployment.copy-yaml")} icon={faCopy}
                                  onClick={() => copyYAML(exportedDeployment, setCopied)} />}
      {copied && <CopyYAMLButton awareness={AwarenessLevel.POSITIVE} id={"file-copy-reference"}
                                 label={t("page-operations.deployment.copied")} icon={faCheck}
                                 onClick={() => copyYAML(exportedDeployment)} />}
      <MonacoEditor height="80vh" defaultLanguage={"yaml"} theme={"vs-dark"}
                    onMount={editor => editor.setValue(exportedDeployment ?? "")}
                    options={{ minimap: { enabled: false }, readOnly: true }} />
    </Modal>
  )
}
