/**
 * Response model representing a DCP configuration item.
 */
export interface DCPDataModel {

  key: string;
  value?: string;
}

/**
 * Request model representing a DCP configuration item.
 */
export interface DCPRequestModel {

  key: string;
  value?: string;
}

/**
 * DCP keys for default SEO configuration parameters.
 */
export enum SEOConfigurationKey {

  PAGE_TITLE = "PAGE_TITLE",
  META_TITLE = "META_TITLE",
  META_DESCRIPTION = "META_DESCRIPTION",
  META_KEYWORDS = "META_KEYWORDS"
}

/**
 * View representation of the default SEO configuration parameters.
 */
export interface SEOConfigurationModel {

  pageTitle?: string;
  defaultTitle?: string;
  defaultDescription?: string;
  defaultKeywords?: string;
}
