import { Permission } from "@/core/domain/auth";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

/**
 * Data model for main menu groups.
 */
export interface MenuGroupData {
  groupKey: string;
  hideGroupHeader?: boolean;
  menuItems: MenuItemData[];
  requiredScope?: Permission
}

/**
 * Data model for main menu items.
 */
export interface MenuItemData {
  itemKey: string;
  path: string;
  icon?: IconDefinition;
  requiredScope?: Permission;
}

/**
 * Data model for user menu items.
 */
export interface UserMenuData {
  name: string;
  path: string;
  clickHandler?: () => void
}
