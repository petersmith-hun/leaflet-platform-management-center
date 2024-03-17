import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { MutableRefObject, ReactNode, useEffect, useRef, useState } from "react";
import { FieldValues, UseFormGetValues, UseFormReset } from "react-hook-form";
import { useTranslation } from "react-i18next";

const autoSaveInterval = 60_000;
const lastSavedTimeFormat = "HH:mm:ss";

interface AutoSavedProps<T extends FieldValues> {
  getValues: UseFormGetValues<T>;
  reset: UseFormReset<T>;
  submitListener: SubmitListener;
}

interface AutoSavedContent<T> {
  lastSaved: string,
  payload: T
}

interface AutoSavedMessageProps {
  restored: MutableRefObject<boolean>;
  lastSaved: DateTime | undefined;
}

const AutoSavedMessage = ({ restored, lastSaved }: AutoSavedMessageProps): ReactNode => {

  const { t } = useTranslation();

  const lastSavedFormatted = lastSaved?.toFormat(lastSavedTimeFormat) ?? t("auto-saved.label.never-saved");
  const message = restored.current
    ? t("auto-saved.label.restored", { lastSaved: lastSavedFormatted })
    : t("auto-saved.label.saved", { lastSaved: lastSavedFormatted });

  return (
    <span>{message}</span>
  )
}

/**
 * Submit event notifier for the auto-save component. Must be initialized and passed by the form.
 */
export class SubmitListener {

  public formSubmitted: boolean = false;
  private _key!: string;

  /**
   * Marks the form submitted and removes the save.
   */
  public submitted(): void {
    this.formSubmitted = true;
    localStorage.removeItem(this._key);
  }

  set key(key: string) {
    this._key = key;
  }
}

/**
 * Renders the auto-save indicator and initializes auto-saving and restoring logic.
 *
 * @param getValues form accessor to grab data for saving
 * @param reset form reset hook to restore data from save
 * @param submitListener SubmitListener instance to notify the component about submitting the form (disables auto-save)
 */
export const AutoSaved = <T extends FieldValues>({ getValues, reset, submitListener }: AutoSavedProps<T>): ReactNode => {

  const [lastSaved, setLastSaved] = useState<DateTime | undefined>();
  const restored = useRef(false);
  const initialized = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const router = useRouter();

  const createKey = (): string => {
    return `lpmc.autosave.${router.asPath}`;
  }

  const tryRestore = (): void => {
    const savedContentRaw = localStorage.getItem(createKey());
    if (savedContentRaw) {
      restored.current = true;
      const savedContent = JSON.parse(savedContentRaw) as AutoSavedContent<T>;
      setLastSaved(DateTime.fromISO(savedContent.lastSaved));
      reset(savedContent.payload);
    }
  }

  const autoSave = (submitListener: SubmitListener): void => {

    if (submitListener.formSubmitted) {
      return;
    }

    restored.current = false;
    const lastSaved = DateTime.now();
    localStorage.setItem(createKey(), JSON.stringify({
      lastSaved: lastSaved.toString(),
      payload: getValues()
    }));
    setLastSaved(lastSaved);
  }

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      submitListener.key = createKey();
      tryRestore();
      intervalRef.current = setInterval(() => autoSave(submitListener), autoSaveInterval);

      window.addEventListener("beforeunload", () => {
        autoSave(submitListener);
      });

      const autoSaveOnRouteChange = () => {
        autoSave(submitListener);
        clearInterval(intervalRef.current);
        router.events.off("routeChangeStart", autoSaveOnRouteChange);
      };

      router.events.on("routeChangeStart", autoSaveOnRouteChange);
    }
  }, []);

  return (
    <div
      className="w-full items-center rounded-lg bg-success-100 px-6 py-2 text-base text-success-700 dark:bg-green-950 dark:text-success-500/80"
      role="alert"
      id="alert-autosave-enabled"
      data-twe-alert-init="">
      <FontAwesomeIcon icon={faCheckCircle} /> <AutoSavedMessage restored={restored} lastSaved={lastSaved} />
    </div>
  )
}
