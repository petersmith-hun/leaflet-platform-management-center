import { ExternalService } from "@/core/client";

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
 * Configuration parameters for external service connections.
 */
export interface ExternalServiceParameters {

  /**
   * Service host.
   */
  host: string;

  /**
   * OAuth client ID for Client Credentials authorization.
   */
  clientID: string;

  /**
   * OAuth client secret for Client Credentials authorization.
   */
  clientSecret: string;

  /**
   * OAuth audience for Client Credentials authorization.
   */
  audience: string;

  /**
   * Requested OAuth scope for Client Credentials authorization.
   */
  scope: string[];

  /**
   * Required "local" user scope for accessing this service.
   */
  requireUserScope?: string;
}

/**
 * External service communication and authorization configuration parameters.
 */
export interface Services {

  /**
   * OAuth authorization server host.
   */
  authorizerHost: string;

  /**
   * OAuth authorization server token endpoint.
   */
  tokenPath: string;

  /**
   * Configured external services
   */
  clients: { [key in ExternalService]: ExternalServiceParameters }
}

/**
 * Application-wide configuration options.
 */
export interface ApplicationConfig {

  oauth: OAuthConfig;
  services: Services
}
