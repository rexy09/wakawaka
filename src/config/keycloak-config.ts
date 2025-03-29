import Keycloak, { KeycloakConfig } from "keycloak-js";
import Env from "./env";

const keycloakConfig: KeycloakConfig = {
  url: Env.KEYCLOAK_URL,
  realm: "flex",
  clientId: Env.KEYCLOAK_CLIENT_ID,
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
