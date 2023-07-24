/****************************************************************************
 **
 ** Author: Justus Muoka
 **
 ****************************************************************************/
import {Authority} from "./common/authority";
import {TqClient} from "./tq-client";

export interface ClientAccountContact {
  acwaCode?: number;
  acwaUsername?: any;
  acwaLoginAllowed?: string;
  acwaPwdChanged?: string;
  acwaPwdReset?: string;
  acwaLoginAttempts?: number;
  acwaPersonelRank?: string;
  acwaDtCreated?: string;
  acwaStatus?: string;
  acwaLastLoginDate?: string;
  acwaClntCode?: number;
  acwaCreatedBy?: string;
  acwaName?: string;
  acwaEmailAddrs?: string;
  acwaType?: string;
  acwaCountry?: any;
  acwaIdRegNo?: any;
  acwaSmsCode?: any;
  acwaMobileNumber?: string;
  acwaPassportNo?: any;
  acwaEmailVerified?: string;
  acwaSpecialClient?: string;
  portalClient?: TqClient;

  // authorities
  authorities?: Authority[];
  emailAddress?: string;
}
