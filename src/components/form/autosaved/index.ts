import { DateTime } from "luxon";

/**
 * Auto-save feature statuses.
 */
export enum AutoSaveStatus {

  /**
   * Auto-save is being initialized, restore-verification is pending.
   */
  INITIALIZING = "INITIALIZING",

  /**
   * Content to be restored is available, auto-save is paused until user interaction (restore or drop auto-saved content).
   */
  PAUSED = "PAUSED",

  /**
   * Auto-saved content has been restored, auto-saving is scheduled.
   */
  RESTORED = "RESTORED",

  /**
   * Auto-saving is active.
   */
  AUTO_SAVING = "AUTO_SAVING"
}

/**
 * Wrapper object for auto-saved contents.
 */
export interface AutoSavedContent<T> {
  lastSaved: string,
  payload: T
}

/**
 * Properties of the AutoSavePausedMessage component.
 */
export interface AutoSavePausedMessageProps {
  lastSaved?: DateTime;
  onRestore: () => void;
  onDrop: () => void;
}

/**
 * Properties of the AutoSavedMessage component.
 */
export interface AutoSavedMessageProps {
  restored: boolean;
  lastSaved?: DateTime;
}

/**
 * Properties of the auto-save handler buttons.
 */
export interface ButtonClickHandlerProps {
  onClick: () => void;
}
