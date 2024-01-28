import { IdentifiedSelfStatusAwareModel } from "@/core/model/common";

/**
 * Supported frontend route authentication requirements.
 */
export enum AuthRequirement {

  /**
   * Route should be shown regardless the authentication status.
   */
  SHOW_ALWAYS = "SHOW_ALWAYS",

  /**
   * Route should be shown for authenticated users only.
   */
  AUTHENTICATED = "AUTHENTICATED",

  /**
   * Route should be shown for unauthenticated (anonymous) users only.
   */
  ANONYMOUS = "ANONYMOUS"
}

/**
 * Supported frontend route types.
 */
export enum RouteType {

  /**
   * Route item is part of the header menu.
   */
  HEADER_MENU = "HEADER_MENU",

  /**
   * Route item is part of the footer menu.
   */
  FOOTER_MENU = "FOOTER_MENU",

  /**
   * Route item is a standalone route, not part of any menus.
   */
  STANDALONE = "STANDALONE",

  /**
   * Route item is a standalone dynamic mask for a group of entry routes.
   */
  ENTRY_ROUTE_MASK = "ENTRY_ROUTE_MASK",

  /**
   * Route item is a standalone dynamic mask for a group of category routes.
   */
  CATEGORY_ROUTE_MASK = "CATEGORY_ROUTE_MASK",

  /**
   * Route item is a standalone dynamic mask for a group of tag routes.
   */
  TAG_ROUTE_MASK = "TAG_ROUTE_MASK"
}

/**
 * Response model representing a single frontend route configuration item.
 */
export interface FrontEndRouteDataModel extends IdentifiedSelfStatusAwareModel<number> {

  routeId: string;
  name: string;
  url: string;
  sequenceNumber: number;
  authRequirement: AuthRequirement;
  type: RouteType;
}

/**
 * Request model representing a frontend route configuration item.
 */
export interface FrontEndRouteRequestModel {

  routeId: string;
  name: string;
  url: string;
  sequenceNumber: number;
  authRequirement: AuthRequirement;
  type: RouteType;
}
