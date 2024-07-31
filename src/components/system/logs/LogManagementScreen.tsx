import { ScreenParameters } from "@/api-environment";
import { CardWithTitle, PageOperationCard, SimpleCard } from "@/components/common/Cards";
import { DataRow, FullWidthDataCell } from "@/components/common/DataRow";
import { InlineLoadingIndicator } from "@/components/common/InlineLoadingIndicator";
import { ToastType } from "@/components/common/OperationResultToast";
import { MultiPaneScreen, NarrowPane, WidePane } from "@/components/common/ScreenLayout";
import { SubmitButton } from "@/components/form/SubmitButton";
import { AwarenessLevel } from "@/components/navigation/OperationButton";
import { LogEventResults } from "@/components/system/logs/LogEventResults";
import { TLQL } from "@/components/system/logs/tlql";
import { tlqlMonacoEditorInit } from "@/components/system/logs/tlql/monaco-editor";
import { toastHandler } from "@/components/utility/toast-handler";
import { ErrorResponse } from "@/core/model/common";
import { emptyLogEventPage, LogEventPage, LogRequest } from "@/core/model/logs";
import { logService } from "@/core/service/log-service";
import { PageContext } from "@/pages/_app";
import { faInfoCircle, faSearch, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import dynamic from "next/dynamic";
import React, { ReactNode, useContext, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

/**
 * Renders the log management screen.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
export const LogManagementScreen = ({ environment }: ScreenParameters): ReactNode => {

  const { getLogs } = logService(environment);
  const { t } = useTranslation();
  const [logs, setLogs] = useState<LogEventPage>(emptyLogEventPage);
  const [loading, setLoading] = useState(false);
  const query = useRef<string>("");
  const { handleSubmit } = useForm<LogRequest>();
  const { triggerToast } = useContext(PageContext);
  const { showCustomToast } = toastHandler(triggerToast, t);
  const MonacoEditor = dynamic(import("@monaco-editor/react"), { ssr: false });

  const onSubmit: SubmitHandler<LogRequest> = (): void => {

    if (!query.current) {
      showCustomToast(t("toast.log-management.query-failure"), t("forms:validation.common.required"), ToastType.WARNING);
      return;
    }

    setLoading(true);

    getLogs(query.current!)
      .then(setLogs)
      .catch((axiosError: AxiosError) => {
        setLogs(emptyLogEventPage);
        showCustomToast(
          t("toast.log-management.query-failure"),
          (axiosError.response?.data as ErrorResponse)?.message ?? axiosError.message,
          axiosError.response?.status === 400
            ? ToastType.WARNING
            : ToastType.ERROR
        );
      })
      .finally(() => setLoading(false));
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <MultiPaneScreen>
          <WidePane>
            <CardWithTitle title={t("page.sub-title.system.logs.query")}>
              <DataRow>
                <FullWidthDataCell>
                  <MonacoEditor height="20vh" defaultLanguage={TLQL.languageID} theme={TLQL.theme}
                                onMount={editor => editor.setValue(query.current ?? "")}
                                onChange={value => query.current = value ?? ""}
                                beforeMount={tlqlMonacoEditorInit}
                                options={{ minimap: { enabled: false } }} />
                </FullWidthDataCell>
              </DataRow>
              {logs.entityCount > 0 && (
                <DataRow>
                  <FullWidthDataCell>
                    <p><FontAwesomeIcon icon={faInfoCircle} /> {t("notification.logs.found", {
                      total: logs.entityCount,
                      visible: logs.entityCountOnPage,
                      currentPage: logs.pageNumber,
                      totalPage: logs.pageCount
                    })}</p>
                  </FullWidthDataCell>
                </DataRow>
              )}
            </CardWithTitle>
          </WidePane>
          <NarrowPane>
            <PageOperationCard title={t("page-operations.logs")}>
              <SubmitButton label={t("page-operations.logs.query")} icon={faSearch}
                            awareness={AwarenessLevel.POSITIVE} />
            </PageOperationCard>
          </NarrowPane>
        </MultiPaneScreen>
      </form>
      <MultiPaneScreen>
        {loading && (
          <WidePane>
            <InlineLoadingIndicator />
          </WidePane>
        )}
        {!logs.entityCount && !loading && (
          <WidePane>
            <SimpleCard>
              <p><FontAwesomeIcon icon={faWarning} /> {t("notification.logs.no-entry-found")}</p>
            </SimpleCard>
          </WidePane>
        )}
        {logs.entityCount > 0 && !loading && <LogEventResults logEventPage={logs} />}
      </MultiPaneScreen>
    </>
  )
}
