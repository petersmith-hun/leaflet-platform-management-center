import { IdentifiedSelfStatusAwareModel } from "@/core/model/common";

/**
 * Supported translation pack locales with their valid locale code.
 */
export enum PackLocale {

  HU = "hu_HU",
  EN = "en"
}

/**
 * Response model representing a translation pack's meta information section.
 */
export interface TranslationPackMetaInfo extends IdentifiedSelfStatusAwareModel<string> {

  id: string,
  packName: string,
  locale: PackLocale;
}

/**
 * Response model representing a single translation definition entry in a translation pack.
 */
export interface TranslationDefinition {

  key: string;
  value: string;
}

/**
 * Response model representing a complete translation pack (including the definitions).
 */
export interface TranslationPack extends TranslationPackMetaInfo {

  definitions: TranslationDefinition[];
}

/**
 * Form backing request model containing the raw translation pack data to be transformed into a pack creation request.
 */
export interface TranslationPackCreationFormData {

  packName: string,
  locale: PackLocale;
  packCSVData: string;
}

/**
 * Request model representing a new translation pack.
 */
export interface TranslationPackCreationRequest {

  packName: string,
  locale: PackLocale;
  definitions: Record<string, string>;
}
