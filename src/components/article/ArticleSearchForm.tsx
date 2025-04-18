import { Input } from "@/components/form/Input";
import { Select } from "@/components/form/Select";
import { SubmitButton } from "@/components/form/SubmitButton";
import { createQueryString } from "@/components/utility/query-string-util";
import { ArticleStatus } from "@/core/model/article";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface SearchForm {
  page: 1;
  orderBy: string;
  orderDirection: string;
  enabled: boolean;
  status: ArticleStatus;
  content: string;
}

/**
 * Article search panel used by the article manager's list screen.
 */
export const ArticleSearchForm = (): ReactNode => {

  const { t } = useTranslation("forms");
  const { register, handleSubmit } = useForm<SearchForm>()
  const router = useRouter();

  const onSubmit: SubmitHandler<SearchForm> = (data) => {
    const searchQuery = createQueryString(data as unknown as Record<string, string>, true);
    const redirectPath = `/articles?${searchQuery}`;
    router.push(redirectPath);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" value="1" {...register("page")} />
      <Select registerReturn={register("orderBy")} label={t("article.search.order-by")} optionMap={{
        "CREATED": t("article.search.order-by.created"),
        "ID": t("article.search.order-by.id"),
        "PUBLISHED": t("article.search.order-by.published"),
        "TITLE": t("article.search.order-by.title")
      }} />
      <Select registerReturn={register("orderDirection")} label={t("article.search.order-direction")} optionMap={{
        "ASC": t("article.search.order-direction.asc"),
        "DESC": t("article.search.order-direction.desc")
      }} />
      <Select registerReturn={register("enabled")} label={t("article.search.enabled")} optionMap={{
        "empty": t("article.search.enabled.any"),
        "true": t("article.search.enabled.yes"),
        "false": t("article.search.enabled.no")
      }} />
      <Select registerReturn={register("status")} label={t("article.search.status")} optionMap={{
        "empty": t("article.search.status.any"),
        [ArticleStatus.DRAFT]: t("article.search.status.draft"),
        [ArticleStatus.REVIEW]: t("article.search.status.review"),
        [ArticleStatus.PUBLIC]: t("article.search.status.public")
      }} />
      <Input registerReturn={register("content")} label={t("article.search.content")} id={"searchContent"} />
      <SubmitButton label={t("article.search")} icon={faSearch} />
    </form>
  )
}
