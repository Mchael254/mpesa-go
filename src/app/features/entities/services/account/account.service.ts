import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject, of } from 'rxjs';

import { Logger } from '../../../../shared/services/logger/logger.service';
import {
  AmlWealthDetailsUpdateDTO,
  BankDetailsUpdateDTO,
  ClientTitleDTO,
  NextKinDetailsUpdateDTO,
  PartyAccountsDetails,
  PersonalDetailsUpdateDTO,
  WealthDetailsUpdateDTO,
} from '../../data/accountDTO';
import { IdentityModeDTO } from '../../data/entityDto';
import { ApiService } from '../../../../shared/services/api/api.service';
import { API_CONFIG } from '../../../../../environments/api_service_config';

const log = new Logger('AccountService');

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private accountsDetail$ = new BehaviorSubject<PartyAccountsDetails>({
    accountCode: 0,
    accountType: 0,
    address: {
      account: {
        accountCode: 0,
        accountTypeId: 0,
        category: '',
        effectiveDateFrom: '',
        effectiveDateTo: '',
        id: 0,
        kycInfo: {
          id: 0,
          name: '',
          shortDesc: '',
          emailAddress: '',
          phoneNumber: '',
        },
        organizationGroupId: 0,
        organizationId: 0,
        partyId: 0,
        partyType: {
          id: 0,
          organizationId: 0,
          partyTypeLevel: 0,
          partyTypeName: '',
          partyTypeShtDesc: '',
          partyTypeVisible: '',
        },
      },
      box_number: '',
      country_id: 0,
      estate: '',
      fax: '',
      house_number: '',
      id: 0,
      is_utility_address: '',
      phoneNumber: '',
      physical_address: '',
      postal_code: '',
      residential_address: '',
      road: '',
      state_id: 0,
      town_id: 0,
      utility_address_proof: '',
      zip: '',
    },
    agentDto: {
      id: 0,
      name: '',
      shortDesc: '',
      emailAddress: '',
      insurerId: 0,
      organizationId: 0,
      agentLicenceNo: '',
      withHoldingTax: 0,
      agentStatus: '',
      blackListReason: '',
      accountTypeId: 0,
      accountType: '',
      businessUnit: '',
      country: '',
      countryCode: 0,
      createdBy: '',
      creditLimit: 0,
      dateOfBirth: '',
      faxNo: '',
      gender: '',
      is_credit_allowed: '',
      modeOfIdentity: '',
      phoneNumber: '',
      physicalAddress: '',
      pinNo: '',
      primaryType: '',
      smsNumber: '',
      stateCode: 0,
      townCode: 0,
      vatApplicable: '',
      withEffectFromDate: '',
      withHoldingTaxApplicable: '',
      status: '',
      agentIdNo: '',
      branchId: 0,
      category: '',
    },
    category: '',
    clientDetails: {
      clientBranchCode: 0,
      clientId: 0,
      titleDto: '',
    },
    clientDto: {
      branchCode: 0,
      category: '',
      clientTitle: '',
      clientType: {
        category: '',
        clientTypeName: '',
        code: 0,
        description: '',
        organizationId: 0,
        person: '',
        type: '',
      },
      country: 0,
      createdBy: '',
      dateOfBirth: '',
      emailAddress: '',
      firstName: '',
      gender: '',
      id: 0,
      idNumber: '',
      lastName: '',
      modeOfIdentity: '',
      occupation: {
        id: 0,
        name: '',
        sector_id: 0,
        short_description: '',
      },
      passportNumber: '',
      phoneNumber: '',
      physicalAddress: '',
      pinNumber: '',
      shortDescription: '',
      status: '',
      withEffectFromDate: '',
    },
    contactDetails: {
      account: {
        accountCode: 0,
        accountTypeId: 0,
        category: '',
        effectiveDateFrom: '',
        effectiveDateTo: '',
        id: 0,
        kycInfo: {
          id: 0,
          name: '',
          shortDesc: '',
          emailAddress: '',
          phoneNumber: '',
        },
        organizationGroupId: 0,
        organizationId: 0,
        partyId: 0,
        partyType: {
          id: 0,
          organizationId: 0,
          partyTypeLevel: 0,
          partyTypeName: '',
          partyTypeShtDesc: '',
          partyTypeVisible: '',
        },
      },
      accountId: 0,
      emailAddress: '',
      id: 0,
      phoneNumber: '',
      preferredChannel: '',
      receivedDocuments: '',
      smsNumber: '',
      titleShortDescription: '',
    },
    country: {
      id: 0,
      name: '',
      short_description: '',
    },
    countryId: 0,
    createdBy: '',
    dateCreated: '',
    dateOfBirth: '',
    effectiveDateFrom: '',
    effectiveDateTo: '',
    firstName: '',
    gender: '',
    id: 0,
    lastName: '',
    modeOfIdentity: {
      id: 0,
      name: '',
      identityFormat: '',
      identityFormatError: '',
      organizationId: 0,
    },
    nextOfKinDetailsList: [
      {
        account: {
          accountCode: 0,
          accountTypeId: 0,
          category: '',
          effectiveDateFrom: '',
          effectiveDateTo: '',
          id: 0,
          kycInfo: {
            id: 0,
            name: '',
            shortDesc: '',
            emailAddress: '',
            phoneNumber: '',
          },
          organizationGroupId: 0,
          organizationId: 0,
          partyId: 0,
          partyType: {
            id: 0,
            organizationId: 0,
            partyTypeLevel: 0,
            partyTypeName: '',
            partyTypeShtDesc: '',
            partyTypeVisible: '',
          },
        },
        emailAddress: '',
        fullName: '',
        id: 0,
        identityNumber: '',
        modeOfIdentity: {
          createdBy: '',
          createdDate: '',
          id: 0,
          identityFormat: '',
          identityFormatError: '',
          modifiedBy: '',
          modifiedDate: '',
          name: '',
          orgCode: 0,
        },
        phoneNumber: '',
        relationship: '',
        smsNumber: '',
      },
    ],
    organizationId: 0,
    partyId: 0,
    partyType: {
      id: 0,
      organizationId: 0,
      partyTypeLevel: 0,
      partyTypeName: '',
      partyTypeShtDesc: '',
      partyTypeVisible: '',
    },
    paymentDetails: {
      account_number: '',
      bank_branch_id: 0,
      currency_id: 0,
      effective_from_date: '',
      effective_to_date: '',
      iban: '',
      id: 0,
      is_default_channel: '',
      mpayno: '',
      partyAccountId: 0,
      preferedChannel: '',
    },
    pinNumber: '',
    serviceProviderDto: {
      category: '',
      country: {
        id: 0,
        name: '',
        short_description: '',
      },
      createdBy: '',
      dateCreated: '',
      dateOfRegistration: '',
      effectiveDateFrom: '',
      emailAddress: '',
      gender: '',
      id: 0,
      idNumber: '',
      modeOfIdentity: '',
      modeOfIdentityDto: {
        id: 0,
        name: '',
        identityFormat: '',
        identityFormatError: '',
        organizationId: 0,
      },
      name: '',
      organizationId: 0,
      parentCompany: '',
      partyId: 0,
      phoneNumber: '',
      physicalAddress: '',
      pinNumber: '',
      postalAddress: '',
      providerLicenseNo: '',
      providerStatus: '',
      providerType: {
        code: 0,
        name: '',
        providerTypeSuffixes: '',
        shortDescription: '',
        shortDescriptionNextNo: '',
        shortDescriptionSerialFormat: '',
        status: '',
        vatTaxRate: '',
        witholdingTaxRate: '',
      },
      shortDescription: '',
      smsNumber: '',
      status: '',
      system: '',
      systemCode: 0,
      title: '',
      tradeName: '',
      type: '',
      vatNumber: '',
    },
    status: '',
    userDto: {
      id: 0,
      name: '',
      username: '',
      userType: '',
      emailAddress: '',
      status: '',
      profileImage: '',
      department: '',
      manager: '',
      telNo: '',
      phoneNumber: '',
      otherPhone: '',
      countryCode: 0,
      townCode: 0,
      personelRank: '',
      city: 0,
      physicalAddress: '',
      postalCode: '',
      departmentCode: 0,
      activatedBy: '',
      updateBy: '',
      dateCreated: '',
      granter: '',
      profilePicture: '',
      organizationId: 0,
      organizationGroupId: 0,
    },
    wealthAmlDetails: {
      certificate_registration_number: '',
      certificate_year_of_registration: '',
      citizenship_country_id: 0,
      cr_form_required: 0,
      cr_form_year: 0,
      distributeChannel: '',
      funds_source: '',
      id: 0,
      insurancePurpose: '',
      is_employed: '',
      is_self_employed: '',
      marital_status: '',
      nationality_country_id: 0,
      occupation_id: 0,
      operating_country_id: 0,
      parent_country_id: 0,
      partyAccountId: 0,
      premiumFrequency: '',
      registeredName: '',
      sector_id: 0,
      source_of_wealth_id: 0,
      tradingName: '',
    },
  });
  currentAccount$ = this.accountsDetail$.asObservable();

  constructor(private api: ApiService) {}

  setCurrentAccounts(accountsDetail: PartyAccountsDetails) {
    this.accountsDetail$.next(accountsDetail);
  }

  getPartyAccountById(id: number): Observable<PartyAccountsDetails> {
    return this.api.GET<PartyAccountsDetails>(
      `${id}/account-details`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  getAccountDetailsByAccountCode(
    accountCode: number
  ): Observable<PartyAccountsDetails> {
    if (!accountCode) {
      return of(null); // Return an empty observable when accountCode is not provided
    }
    const params = new HttpParams().set('accountCode', `${accountCode}`);
    return this.api.GET<PartyAccountsDetails>(
      `accounts/details`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      params
    );
  }

  updatePersonalDetails(
    data: PersonalDetailsUpdateDTO,
    id: number
  ): Observable<PersonalDetailsUpdateDTO> {
    return this.api.POST<PersonalDetailsUpdateDTO>(
      `${id}/personal-details`,
      JSON.stringify(data),
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  updateBankDetails(
    data: BankDetailsUpdateDTO,
    id: number
  ): Observable<BankDetailsUpdateDTO> {
    return this.api.POST<BankDetailsUpdateDTO>(
      `${id}/bank-details`,
      JSON.stringify(data),
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  updateWealthDetails(
    data: WealthDetailsUpdateDTO,
    id: number
  ): Observable<WealthDetailsUpdateDTO> {
    return this.api.POST<WealthDetailsUpdateDTO>(
      `${id}/wealth-details`,
      JSON.stringify(data),
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  updateAmlWealthDetails(
    data: AmlWealthDetailsUpdateDTO,
    id: number
  ): Observable<AmlWealthDetailsUpdateDTO> {
    return this.api.POST<AmlWealthDetailsUpdateDTO>(
      `${id}/aml-details`,
      JSON.stringify(data),
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  updateNextOfKinDetails(
    data: NextKinDetailsUpdateDTO,
    id: number
  ): Observable<NextKinDetailsUpdateDTO> {
    return this.api.POST<NextKinDetailsUpdateDTO>(
      `${id}/next-of-kin-details`,
      JSON.stringify(data),
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  getClientTitles(organizationId: number): Observable<ClientTitleDTO[]> {
    log.info('Fetching Client Title');
    const params = new HttpParams();

    if (organizationId !== undefined && organizationId !== null) {
      params['organizationId'] = organizationId.toString();
    }

    return this.api.GET<ClientTitleDTO[]>(
      `client-titles`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      params
    );
  }

  getIdentityMode(organizationId: number): Observable<IdentityModeDTO[]> {
    log.info('Fetching Mode of Identity');
    const params = new HttpParams().set('organizationId', `${organizationId}`);

    return this.api.GET<IdentityModeDTO[]>(
      `identity-modes`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      params
    );
  }
}
