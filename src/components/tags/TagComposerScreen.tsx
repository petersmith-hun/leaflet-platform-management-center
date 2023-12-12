import { APIEnvironment } from "@/api-environment";
import { CardWithTitle, PageOperationCard } from "@/components/common/Cards";
import { DataRow, WideDataCell } from "@/components/common/DataRow";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { Input } from "@/components/form/Input";
import { SubmitButton } from "@/components/form/SubmitButton";
import { AwarenessLevel, PageOperationButton } from "@/components/navigation/OperationButton";
import { TagSubmission } from "@/components/tags/operations/TagSubmission";
import { TagEditRequest, TagModel } from "@/core/model/tag";
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
 *
 * @param environment
 * @param tag
 * @param mutate
 */
export const TagComposerScreen = ({ environment, tag, mutate }: TagComposerScreenProps): ReactNode => {

  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<TagEditRequest>({
    defaultValues: tag
  });
  const router = useRouter();
  const tagID = router.query.id as number | undefined;

  useEffect(() => {
    const init = async () => {
      const { Input, Select, initTE } = await import("tw-elements");
      initTE({ Input, Select }, { allowReinits: true });
    };
    init();
  }, []);

  return (
    <TagSubmission environment={environment} mutate={mutate} handleSubmit={handleSubmit}>
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
    </TagSubmission>
  )
}
