import { ItemListCard } from "@/components/common/Cards";
import { FormattedArticleDate } from "@/components/common/FormattedDateItem";
import { ItemEnabledStatusFlag } from "@/components/common/ItemEnabledStatusFlag";
import { Separator } from "@/components/common/Separator";
import { DropdownMenu, ViewDropdownMenuItem } from "@/components/navigation/DropdownMenu";
import { TranslationPackMetaInfo } from "@/core/model/translations";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface TranslationPackCardProps {
  pack: TranslationPackMetaInfo;
}

/**
 * Renders a card in the translation pack list displaying the summary of a pack.
 *
 * @param pack translation pack data to be rendered
 */
export const TranslationPackCard = ({ pack }: TranslationPackCardProps): ReactNode => {

  const { t } = useTranslation();

  return (
    <ItemListCard>
      <div className="w-5/12">
        <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
          <Link href={`/system/translations/view/${pack.id}`} className="text-primary-400 hover:text-primary-200">
            {pack.packName}
          </Link>
        </h5>
        <Separator thick={false} />
        <span>{t(`forms:pack.edit.locale.${pack.locale}`)}</span>
      </div>
      <div className="w-3/12 text-sm text-neutral-300">
        <FormattedArticleDate date={pack.created} icon={faEdit} />
      </div>
      <div className="w-2/12 text-center">
        <ItemEnabledStatusFlag item={pack} />
      </div>
      <div className="w-2/12 flex flex-col items-end">
        <DropdownMenu id={`pack-${pack.id}`}>
          <ViewDropdownMenuItem link={`/system/translations/view/${pack.id}`} />
        </DropdownMenu>
      </div>
    </ItemListCard>
  )
}
