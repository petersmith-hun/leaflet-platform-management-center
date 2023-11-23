/**
 * OAuth Authorization Code Grant Flow configuration to connect the application to an OAuth Authorization Server.
 * Currently, it requires Leaflet Access Gateway Service and the connection is configured using next-auth.
 */
export interface OAuthConfig {

  /**
   * Arbitrary OAuth provider ID.
   */
  id: string;

  /**
   * Arbitrary display name of the OAuth provider (will be displayed on the login screen).
   */
  name: string;

  /**
   * Authorization server base URL.
   */
  authorizationServerURL: string;

  /**
   * OAuth client ID of the application.
   */
  clientID: string;

  /**
   * OAuth client secret of the application.
   */
  clientSecret: string;

  /**
   * OAuth audience of the target service.
   */
  audience: string;
}

/**
 * Application identification information.
 */
export interface AppInfoConfig {

  /**
   * Display name of the application.
   */
  applicationName: string;

  /**
   * Application short name.
   */
  abbreviation: string;

  /**
   * Application version.
   */
  version: string;

  /**
   * Build time (indicates "snapshot" for local dev builds).
   */
  buildTime: string;
}

/**
 * Application-wide configuration options.
 */
export interface ApplicationConfig {

  oauth: OAuthConfig;
}
