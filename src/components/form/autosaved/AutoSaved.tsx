import { AutoSave } from "@/components/form/autosaved/autosave";
import { AutoSavedMessage, AutoSavePausedMessage } from "@/components/form/autosaved/AutoSavedMessage";
import { DateTime } from "luxon";
import { NextRouter, useRouter } from "next/router";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { FieldValues, UseFormGetValues, UseFormReset } from "react-hook-form";

interface AutoSavedProps<T extends FieldValues> {
  getValues: UseFormGetValues<T>;
  reset: UseFormReset<T>;
  submitListener: SubmitListener;
}

/**
 * Submit event notifier for the auto-save component. Must be initialized and passed by the form.
 */
export class SubmitListener {

  public formSubmitted: boolean = false;
  public readonly key: string;

  constructor(router: NextRouter) {
    this.key = this.createKey(router);
  }

  /**
   * Marks the form submitted and removes the save.
   */
  public submitted(): void {
    this.formSubmitted = true;
    localStorage.removeItem(this.key);
  }

  private createKey(router: NextRouter): string {
    return `lpmc.autosave.${router.asPath}`;
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
  const router = useRouter();
  const autoSaveHandler = useMemo<AutoSave<T>>(() => new AutoSave<T>(submitListener, router, getValues, reset, setLastSaved), []);

  useEffect(() => {
    autoSaveHandler.initAutoSave();
  }, []);

  return (
    <div
      className={`w-full items-center rounded-lg px-6 py-2 text-base ${autoSaveHandler.isPaused()
        ? "bg-warning-100 text-warning-700 dark:bg-warning-950 dark:text-warning-500/80" 
        : "bg-success-100 text-success-700 dark:bg-green-950 dark:text-success-500/80"}`}
      role="alert"
      id="alert-autosave-status"
      data-twe-alert-init="">
      {autoSaveHandler.isPaused()
        ? <AutoSavePausedMessage onRestore={() => autoSaveHandler.tryRestore()} onDrop={() => autoSaveHandler.dropStored()} lastSaved={lastSaved} />
        : <AutoSavedMessage restored={autoSaveHandler.isRestored()} lastSaved={lastSaved} />}
    </div>
  )
}
