import { AppInfoConfig } from "@/core/domain/config";
import buildTime from "../build-time.json";
import packageJson from "../package.json";

/**
 * Application info provider.
 */
const applicationInfo: AppInfoConfig = {
  applicationName: "Leaflet Platform Management Center",
  abbreviation: "LPMC",
  version: packageJson.version,
  buildTime: buildTime.buildTime ?? "snapshot"
}

export default applicationInfo;
