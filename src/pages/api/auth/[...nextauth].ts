import applicationConfig from "@/application-config";
import { Permission } from "@/core/domain/auth";
import NextAuth, { AuthOptions } from "next-auth"

const tokenURL = `${applicationConfig.oauth.authorizationServerURL}/oauth/token?audience=${applicationConfig.oauth.audience}`;
const authorizationURL = `${applicationConfig.oauth.authorizationServerURL}/oauth/authorize`;
const jwksEndpoint = `${applicationConfig.oauth.authorizationServerURL}/.well-known/jwks`;
const userInfoURL = `${applicationConfig.oauth.authorizationServerURL}/oauth/userinfo`;

export const options: AuthOptions = {

  /**
   * Authorization callback functions.
   */
  callbacks: {

    /**
     * Copies the access token and its claimed scope from the Account object into the Token object.
     *
     * @param token parsed JWT token object
     * @param account user account info
     */
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.scope = account.scope
      }
      return token
    },

    /**
     * Copies the access token and its claimed scope from the Token object into the user's Session object.
     *
     * @param session user session information
     * @param token parsed JWT token object
     */
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.scope = (token.scope as string)
        .split(" ")
        .filter(scope => Object.values(Permission).includes(scope as Permission))
        .map(scope => scope as Permission)

      return session
    }
  },

  /**
   * Session configuration.
   */
  session: {

    /**
     * Since LAGS supports using JWT access tokens, session strategy is set to JWT.
     */
    strategy: "jwt"
  },

  /**
   * Provider configuration. Currently, only LAGS is supported.
   */
  providers: [
    {
      id: applicationConfig.oauth.id,
      name: applicationConfig.oauth.name,
      type: "oauth",
      clientId: applicationConfig.oauth.clientID,
      clientSecret: applicationConfig.oauth.clientSecret,
      token: {
        url: tokenURL
      },
      authorization: {
        params: {
          scope: undefined,
          response_type: "code"
        },
        url: authorizationURL
      },
      jwks_endpoint: jwksEndpoint,
      userinfo: {
        url: userInfoURL
      },
      idToken: false,
      checks: ["state"],
      profile: profile => {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email
        }
      }
    }
  ],
};

/**
 * OAuth Authorization Code Grant Flow configuration using LAGS as Authorization Server.
 */
export default NextAuth(options);
