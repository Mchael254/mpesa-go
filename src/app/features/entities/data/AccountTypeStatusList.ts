import {AccountStatus} from "./AccountStatus";
import { AccountType } from "./enums/AccountType";

export interface AccountTypeStatusList {
    accountType:  AccountType,
    statusTypes:  AccountStatus[]
}