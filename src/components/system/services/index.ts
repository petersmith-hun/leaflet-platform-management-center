import { RegisteredServices, ServiceStatus, ServiceStatusSummary } from "@/core/model/cluster";

/**
 * Creates a default service status object, with the "up" flag set to "polling" and the abbreviation present, everything
 * else set to empty string.
 *
 * @param serviceAbbreviation service abbreviation as reported by the "registered services" endpoint
 */
export const defaultServiceStatus = (serviceAbbreviation: string): ServiceStatus => {

  return {
    app: {
      name: "",
      abbreviation: serviceAbbreviation
    },
    build: {
      time: "",
      version: ""
    },
    up: "polling"
  }
}

/**
 * Creates a default service status state object for setting the initial status of the dashboard.
 *
 * @param services list of registered services
 */
export const defaultStatusState = (services: RegisteredServices): Record<string, ServiceStatus> => {
  return Object.fromEntries(services.registeredServices.map(service => [service, defaultServiceStatus(service)]))
}

/**
 * Creates a service status summary object based on the discovery (healthcheck) results.
 *
 * @param services list of reported service statuses by their abbreviation
 */
export const createServiceStatusSummary = (services: Record<string, ServiceStatus>): ServiceStatusSummary => {

  return {
    countAll: Object.keys(services).length,
    countNotResponding: Object.values(services)
      .filter(service => !service.up)
      .length
  }
}
