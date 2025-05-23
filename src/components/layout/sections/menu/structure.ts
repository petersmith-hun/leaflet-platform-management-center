import { MenuGroupData, MenuItemData } from "@/components/layout/sections/menu/index";
import { Permission } from "@/core/domain/auth";
import { faDocker } from "@fortawesome/free-brands-svg-icons";
import {
  faDice,
  faDirections,
  faExternalLink,
  faFile,
  faFileText,
  faFolder,
  faGlobe,
  faHome,
  faLanguage,
  faNewspaper,
  faPlus,
  faSignal,
  faTags,
  faUsers
} from "@fortawesome/free-solid-svg-icons";
import { faKey } from "@fortawesome/free-solid-svg-icons/faKey";

const rootGroup: MenuItemData[] = [
  {
    itemKey: "group.root.item.home",
    path: "/",
    icon: faHome
  }
];

const quickCreation: MenuItemData[] = [
  {
    itemKey: "group.quick_creation.item.article",
    path: "/articles/create",
    icon: faPlus,
    requiredScope: Permission.WRITE_ENTRIES
  }
];

const systemManagement: MenuItemData[] = [
  {
    itemKey: "group.system_management.item.seo",
    path: "/system/seo",
    icon: faGlobe,
    requiredScope: Permission.READ_ADMIN
  },
  {
    itemKey: "group.system_management.item.routes",
    path: "/system/routes",
    icon: faDirections,
    requiredScope: Permission.READ_ADMIN
  },
  {
    itemKey: "group.system_management.item.translations",
    path: "/system/translations",
    icon: faLanguage,
    requiredScope: Permission.READ_ADMIN
  },
  {
    itemKey: "group.system_management.item.failover",
    path: "/system/failover",
    requiredScope: Permission.READ_ADMIN
  }
];

const infraManagement: MenuItemData[] = [
  {
    itemKey: "group.infra_management.item.services",
    path: "/system/services",
    icon: faSignal,
    requiredScope: Permission.READ_ADMIN
  },
  {
    itemKey: "group.infra_management.item.cluster",
    path: "/system/docker/status",
    icon: faDocker,
    requiredScope: Permission.READ_ADMIN
  },
  {
    itemKey: "group.infra_management.item.registry",
    path: "/system/docker/registry",
    icon: faDocker,
    requiredScope: Permission.READ_ADMIN
  },
  {
    itemKey: "group.infra_management.item.logs",
    path: "/system/logs",
    icon: faFileText,
    requiredScope: Permission.READ_ADMIN
  },
  {
    itemKey: "group.infra_management.item.domino",
    path: "/system/deployments",
    icon: faDice,
    requiredScope: Permission.WRITE_ADMIN
  },
  {
    itemKey: "group.infra_management.item.secrets",
    path: "/system/secrets",
    icon: faKey,
    requiredScope: Permission.WRITE_ADMIN
  }
];

const userManagement: MenuItemData[] = [
  {
    itemKey: "group.access_management.item.users",
    path: "/users",
    icon: faUsers,
    requiredScope: Permission.READ_USERS
  }
];

const documentManagement: MenuItemData[] = [
  {
    itemKey: "group.document_management.item.documents",
    path: "/documents",
    icon: faFileText,
    requiredScope: Permission.READ_DOCUMENTS
  }
];

const blogManagement: MenuItemData[] = [
  {
    itemKey: "group.blog_management.item.articles",
    path: "/articles",
    icon: faNewspaper,
    requiredScope: Permission.READ_ENTRIES
  },
  {
    itemKey: "group.blog_management.item.categories",
    path: "/categories",
    icon: faFolder,
    requiredScope: Permission.READ_CATEGORIES
  },
  {
    itemKey: "group.blog_management.item.tags",
    path: "/tags",
    icon: faTags,
    requiredScope: Permission.READ_TAGS
  },
  {
    itemKey: "group.blog_management.item.files",
    path: "/files/browse",
    icon: faFile,
    requiredScope: Permission.READ_ENTRIES
  }
];

const externalSystems: MenuItemData[] = [
  {
    itemKey: "CircleCI",
    path: "https://app.circleci.com",
    icon: faExternalLink
  },
  {
    itemKey: "GitHub Packages",
    path: "https://github.com/petersmith-hun?tab=packages",
    icon: faExternalLink
  },
  {
    itemKey: "Grafana",
    path: "https://monitoring.psprog.hu",
    icon: faExternalLink
  },
];

/**
 * Main menu structure.
 */
export const mainMenu: MenuGroupData[] = [
  {
    groupKey: "group.root",
    hideGroupHeader: true,
    menuItems: rootGroup
  },
  {
    groupKey: "group.quick_creation",
    menuItems: quickCreation,
    requiredScope: Permission.WRITE_ENTRIES
  },
  {
    groupKey: "group.system_management",
    menuItems: systemManagement,
    requiredScope: Permission.READ_ADMIN
  },
  {
    groupKey: "group.infra_management",
    menuItems: infraManagement,
    requiredScope: Permission.READ_ADMIN
  },
  {
    groupKey: "group.access_management",
    menuItems: userManagement,
    requiredScope: Permission.READ_USERS
  },
  {
    groupKey: "group.document_management",
    menuItems: documentManagement,
    requiredScope: Permission.READ_DOCUMENTS
  },
  {
    groupKey: "group.blog_management",
    menuItems: blogManagement,
    requiredScope: Permission.READ_ENTRIES
  },
  {
    groupKey: "group.external_systems",
    menuItems: externalSystems,
    requiredScope: Permission.READ_ADMIN
  },
];
