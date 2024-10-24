/****************************************************************************
 ** This is a data class that represents the oauth token:
 *
 * accessToken: string - the access token
 * tokenType: string - the token type
 * refreshToken: string - the refresh token
 * expiresIn: number - the expiry time in seconds
 * scope: string - the scope
 * refreshExpiresIn: number - the refresh expiry time in seconds
 ****************************************************************************/

export interface OauthToken {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  refresh_expires_in: number;
  organizationId?: string;
}
