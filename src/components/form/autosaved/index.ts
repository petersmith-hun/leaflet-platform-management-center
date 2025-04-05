import { DateTime } from "luxon";

export interface AutoSavedContent<T> {
  lastSaved: string,
  payload: T
}

export interface AutoSavePausedMessageProps {
  lastSaved?: DateTime;
  onRestore: () => void;
  onDrop: () => void;
}

export enum AutoSaveStatus {
  INITIALIZING = "INITIALIZING",
  PAUSED = "PAUSED",
  RESTORED = "RESTORED",
  AUTO_SAVING = "AUTO_SAVING"
}

export interface AutoSavedMessageProps {
  restored: boolean;
  lastSaved?: DateTime;
}

export interface ButtonClickHandlerProps {
  onClick: () => void;
}