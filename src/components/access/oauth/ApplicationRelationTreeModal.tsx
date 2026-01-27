import { Modal } from "@/components/common/Modal";
import { OAuthApplicationModel, TargetApplicationModel } from "@/core/model/oauth";
import { TFunction } from "i18next";
import React, { ReactNode, useCallback, useState } from "react";
import Tree, { RawNodeDatum } from "react-d3-tree";
import { useTranslation } from "react-i18next";

const createRelations = (t: TFunction, relation: "upstream" | "downstream", applications?: TargetApplicationModel[]): RawNodeDatum[] => {

  return applications?.map(application => { return {
    name: application.name,
    attributes: {
      [t("oauth-application.label.tree.client-id")]: application.clientID,
      [t("oauth-application.label.tree.relation")]: t(`oauth-application.label.tree.relation.${relation}`)
    },
    children: []
  }}) ?? [];
}

const createTreeData = (t: TFunction, application: OAuthApplicationModel): RawNodeDatum => {

  return {
    name: application.name,
    children: [
      ...createRelations(t, "upstream", application.resourceServer?.allowedClients.map(client => client.application)),
      ...createRelations(t, "downstream", application.client?.resourceServers)
    ]
  }
}

const useCenteredTree = () => {

  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const containerRef = useCallback((containerElem: HTMLDivElement) => {
    if (containerElem !== null) {
      const { width, height } = containerElem.getBoundingClientRect();
      setTranslate({ x: width / 2 - 200, y: height / 2 });
    }
  }, []);

  return { translate, containerRef };
};

interface ApplicationRelationTreeProps {
  application: OAuthApplicationModel;
}

/**
 * Modal window showing the immediate relations (clients and/or resource servers) of the given OAuth application.
 *
 * @param application OAuth application data
 */
export const ApplicationRelationTreeModal = ({ application }: ApplicationRelationTreeProps): ReactNode => {

  const { t } = useTranslation();
  const { translate, containerRef } = useCenteredTree();

  return (
    <Modal id={"oauth-application-tree-modal"} title={t("modal.title.oauth-application-tree", { application: application.name })}>
      <div style={{ height: "800px" }} ref={containerRef}>

        <Tree orientation={"horizontal"}
              draggable={true}
              collapsible={false}
              zoomable={false}
              pathFunc={"step"}
              translate={translate}
              separation={{ siblings: 1, nonSiblings: 2 }}
              nodeSize={{ x: 200, y: 100 }}
              scaleExtent={{ min: 1, max: 1 }}
              data={[createTreeData(t, application)]} />
      </div>
    </Modal>
  );
}
