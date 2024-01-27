import { APIEnvironment } from "@/api-environment";
import { dcpFacade } from "@/core/facade/dcp-facade";
import { SEOConfigurationKey, SEOConfigurationModel } from "@/core/model/dcp";

interface DefaultSEOFacade {

  /**
   * Retrieves the current default SEO configuration.
   */
  retrieveConfiguration: () => Promise<SEOConfigurationModel>;

  /**
   * Updates the default SEO configuration.
   *
   * @param seo new SEO configuration
   */
  updateConfiguration: (seo: SEOConfigurationModel) => Promise<void>;
}

const keyMapping = new Map<SEOConfigurationKey, (config: SEOConfigurationModel) => string | undefined>([
  [SEOConfigurationKey.PAGE_TITLE, config => config.pageTitle],
  [SEOConfigurationKey.META_TITLE, config => config.defaultTitle],
  [SEOConfigurationKey.META_DESCRIPTION, config => config.defaultDescription],
  [SEOConfigurationKey.META_KEYWORDS, config => config.defaultKeywords]
]);

/**
 * Facade implementation coordinating the default SEO configuration operations.
 *
 * @param environment APIEnvironment object defining the target API configuration
 */
const defaultSEOFacade = (environment: APIEnvironment): DefaultSEOFacade => {

  const { retrieveConfiguration, updateConfiguration, extractItem } = dcpFacade<SEOConfigurationModel>(environment);

  return {

    async retrieveConfiguration(): Promise<SEOConfigurationModel> {

      return retrieveConfiguration(dcp => {
        return {
          pageTitle: extractItem(dcp, SEOConfigurationKey.PAGE_TITLE),
          defaultTitle: extractItem(dcp, SEOConfigurationKey.META_TITLE),
          defaultDescription: extractItem(dcp, SEOConfigurationKey.META_DESCRIPTION),
          defaultKeywords: extractItem(dcp, SEOConfigurationKey.META_KEYWORDS)
        }
      });
    },

    async updateConfiguration(seo: SEOConfigurationModel): Promise<void> {

      return updateConfiguration(seo, config => Object.keys(SEOConfigurationKey)
        .map(key => {
          return {
            key: key,
            value: keyMapping.get(key as SEOConfigurationKey)!(config)
          }
        })
      );
    }
  }
}

export default defaultSEOFacade;
