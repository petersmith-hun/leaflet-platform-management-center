import { SubmitListener } from "@/components/form/autosaved/AutoSaved";
import { AutoSavedContent, AutoSaveStatus } from "@/components/form/autosaved/index";
import { DateTime } from "luxon";
import { NextRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { FieldValues, UseFormGetValues, UseFormReset } from "react-hook-form";

const autoSaveInterval = 60_000;

/**
 * Auto-save feature driver implementation.
 */
export class AutoSave<T extends FieldValues> {

  private readonly submitListener: SubmitListener;
  private readonly router: NextRouter;
  private readonly getFormValues: UseFormGetValues<T>;
  private readonly resetForm: UseFormReset<T>;
  private readonly setLastSaved: Dispatch<SetStateAction<DateTime | undefined>>;

  private status: AutoSaveStatus;
  private intervalRef?: NodeJS.Timeout = undefined;

  constructor(submitListener: SubmitListener, router: NextRouter,
              getFormValues: UseFormGetValues<T>, resetForm: UseFormReset<T>,
              setLastSaved: Dispatch<SetStateAction<DateTime | undefined>>) {

    this.status = AutoSaveStatus.INITIALIZING;
    this.submitListener = submitListener;
    this.router = router;
    this.getFormValues = getFormValues;
    this.resetForm = resetForm;
    this.setLastSaved = setLastSaved;
  }

  /**
   * Initializes auto-save feature. Pauses auto-save right away, if a stored version is available when the editor screen is loaded.
   */
  public initAutoSave(): void {

    this.verifyStoredVersion();

    if (this.status === AutoSaveStatus.PAUSED) {
      return;
    }

    if (this.status === AutoSaveStatus.INITIALIZING) {
      this.startAutoSave();
    }
  }

  /**
   * Tries restoring the auto-saved version of the content (if available).
   */
  public tryRestore(): void {

    const savedContent = this.getStoredContent();
    if (savedContent) {
      this.status = AutoSaveStatus.RESTORED;
      this.setLastSaved(DateTime.fromISO(savedContent.lastSaved));
      this.resetForm(savedContent.payload);
    }

    this.startAutoSave();
  }

  /**
   * Drops auto-saved version of the content.
   */
  public dropStored(): void {

    localStorage.removeItem(this.submitListener.key);
    this.status = AutoSaveStatus.INITIALIZING;
    this.setLastSaved(undefined);
    this.startAutoSave();
  }

  /**
   * Checks if auto-saving is currently paused.
   */
  public isPaused(): boolean {
    return this.status === AutoSaveStatus.PAUSED;
  }

  /**
   * Checks if the content was restored from auto-saved version.
   */
  public isRestored(): boolean {
    return this.status == AutoSaveStatus.RESTORED;
  }

  private verifyStoredVersion(): void {

    const storedContent = this.getStoredContent();
    if (storedContent !== undefined) {
      this.status = AutoSaveStatus.PAUSED;
      this.setLastSaved(DateTime.fromISO(storedContent.lastSaved));
    }
  }

  private getStoredContent(): AutoSavedContent<T> | undefined {

    const savedContentRaw = localStorage.getItem(this.submitListener.key);

    return savedContentRaw
      ? JSON.parse(savedContentRaw) as AutoSavedContent<T>
      : undefined;
  }

  private startAutoSave(): void {
    this.intervalRef = setInterval(() => this.autoSave(), autoSaveInterval);

    window.addEventListener("beforeunload", () => {
      this.autoSave();
    });

    const autoSaveOnRouteChange = () => {
      this.autoSave();
      clearInterval(this.intervalRef);
      this.router.events.off("routeChangeStart", autoSaveOnRouteChange);
    };

    this.router.events.on("routeChangeStart", autoSaveOnRouteChange);
  }

  private autoSave(): void {

    if (this.submitListener.formSubmitted) {
      return;
    }

    this.status = AutoSaveStatus.AUTO_SAVING;
    const lastSaved = DateTime.now();
    localStorage.setItem(this.submitListener.key, JSON.stringify({
      lastSaved: lastSaved.toString(),
      payload: this.getFormValues()
    }));
    this.setLastSaved(lastSaved);
  }
}
