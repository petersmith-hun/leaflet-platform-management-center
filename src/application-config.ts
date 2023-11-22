import { ApplicationConfig } from "@/core/domain/config";
import packageJson from "../package.json";
import buildTime from "../build-time.json";

/**
 * MAin configuration provider.
 *
 */
const applicationConfig: ApplicationConfig = {
  oauth: {
    id: process.env.OAUTH_ID as string,
    name: process.env.OAUTH_NAME as string,
    authorizationServerURL: process.env.OAUTH_AUTHORIZATION_SERVER_URL as string,
    clientID: process.env.OAUTH_CLIENT_ID as string,
    clientSecret: process.env.OAUTH_CLIENT_SECRET as string,
    audience: process.env.OAUTH_AUDIENCE as string
  },
  info: {
    applicationName: "Leaflet Platform Management Center",
    abbreviation: "LPMC",
    version: packageJson.version,
    buildTime: buildTime.buildTime ?? "snapshot"
  },
  external: {
    archiva: process.env.NEXT_PUBLIC_EXT_ARCHIVA ?? "",
    circleCi: process.env.NEXT_PUBLIC_EXT_CIRCLE_CI ?? "",
    grafana: process.env.NEXT_PUBLIC_EXT_GRAFANA ?? ""
  }
}

export default applicationConfig;
