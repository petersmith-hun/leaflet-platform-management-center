import { APIEnvironment } from "@/api-environment";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, WideDataCell } from "@/components/common/DataRow";
import { SubmitOperation } from "@/components/common/operations/SubmitOperation";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { Input } from "@/components/form/Input";
import { SubmitButton } from "@/components/form/SubmitButton";
import { AwarenessLevel, PageOperationButton } from "@/components/navigation/OperationButton";
import { TagEditRequest, TagModel } from "@/core/model/tag";
import tagService from "@/core/service/tag-service";
import { faEye, faFloppyDisk, faList } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface TagComposerScreenProps {
  environment: APIEnvironment;
  tag?: TagModel;
  mutate?: KeyedMutator<TagModel>;
}

/**
 * Screen used by tag manager's create/edit operations. For editing purpose, provide the tag itself, as well as an SWR
 * mutate function to invalidate the cache for the edited tag.
 *
 * @param environment APIEnvironment object defining the target API configuration
 * @param tag tag data for the editor
 * @param mutate SWR mutate function for data invalidation
 */
export const TagComposerScreen = ({ environment, tag, mutate }: TagComposerScreenProps): ReactNode => {

  const { createTag, editTag } = tagService(environment);
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<TagEditRequest>({
    defaultValues: tag
  });
  const router = useRouter();
  const tagID = router.query.id as number | undefined;

  useEffect(() => {
    const init = async () => {
      const { Input, initTE } = await import("tw-elements");
      initTE({ Input }, { allowReinits: true });
    };
    init();
  }, []);

  return (
    <SubmitOperation domain={"tag"} mutate={mutate} titleSupplier={tag => tag.name}
                     handleSubmit={handleSubmit}
                     serviceCall={entity => tagID
                       ? editTag(tagID, entity)
                       : createTag(entity)}>
      <MultiPaneScreen>
        <WidePane>
          <CardWithTitle title={tag?.name ?? t("page.title.tag.create")}>
            <DataRow>
              <WideDataCell>
                <Input registerReturn={register("name", { required: t("forms:validation.common.required") })}
                       label={t("forms:tag.edit.name")} id={"tag-name"}
                       errorSupplier={() => errors.name?.message} />
              </WideDataCell>
            </DataRow>
          </CardWithTitle>
        </WidePane>
        <NarrowPane>
          <PageOperationCard title={t("page-operations.tag")}>
            <PageOperationButton label={t("page-operations.tag.back-to-tags")} icon={faList}
                                 link={"/tags"} />
            {tagID && <PageOperationButton label={t("page-operations.tag.view")} icon={faEye}
                                           link={`/tags/view/${tagID}`} />}
            <SubmitButton label={t("page-operations.common.save")} icon={faFloppyDisk}
                          awareness={AwarenessLevel.POSITIVE} />
          </PageOperationCard>
        </NarrowPane>
      </MultiPaneScreen>
    </SubmitOperation>
  )
}
