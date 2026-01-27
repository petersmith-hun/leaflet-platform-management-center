import {
  ApplicationType,
  ClientApplicationModel,
  ClientApplicationRequest,
  OAuthApplicationModel,
  OAuthApplicationRegistrationRequest,
  RegistrationType,
  ResourceServerApplicationModel,
  ResourceServerApplicationRequest
} from "@/core/model/oauth";

const mapClientApplication = (client: ClientApplicationModel): ClientApplicationRequest => ({
  allowedCallbacks: client.allowedCallbacks.map(callback => ({
    id: callback.id,
    url: callback.url
  })),
  requiredPermissions: client.requiredPermissions.map(permission => permission.id)
});

const mapResourceServerApplication = (resourceServer: ResourceServerApplicationModel): ResourceServerApplicationRequest => ({
  allowedClients: resourceServer.allowedClients.map(allowedClient => ({
    applicationID: allowedClient.application.id,
    allowedPermissions: allowedClient.allowedPermissions.map(permission => permission.id)
  })),
  audience: resourceServer.audience,
  registeredPermissions: resourceServer.registeredPermissions.map(permission => permission.id)
});

const mapRegistrationType = (application: OAuthApplicationModel): RegistrationType => application.applicationType === ApplicationType.UI
  ? RegistrationType.CLIENT
  : (application.client ? RegistrationType.MIDDLE_RESOURCE_SERVER : RegistrationType.RESOURCE_SERVER);

/**
 * Maps the given OAuthApplicationModel to OAuthApplicationRegistrationRequest (for editing an existing application).
 *
 * @param application source data to map
 */
export const mapApplicationToRequest = (application?: OAuthApplicationModel): OAuthApplicationRegistrationRequest | undefined => {

  if (!application) {
    return undefined;
  }

  return {
    name: application.name,
    clientID: application.clientID,
    registrationType: mapRegistrationType(application),
    client: application.client ? mapClientApplication(application.client) : undefined,
    resourceServer: application.resourceServer ? mapResourceServerApplication(application.resourceServer) : undefined
  }
}
