/****************************************************************************
 **
 ** Author: denisbgitonga@gmail.com
 **
 ****************************************************************************/

export interface OauthToken {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  refresh_expires_in: number;
}
