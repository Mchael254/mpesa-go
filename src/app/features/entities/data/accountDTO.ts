import { AgentDTO } from "./AgentDTO";
import { StaffDto } from "./StaffDto";
import { IdentityModeDTO } from "./entityDto";
import { PartyTypeDto } from "./partyTypeDto";

export interface AccountDTO {
}

export interface kycInfoDTO {
    id?: number;
    name?: string;
    shortDesc?: string;
    emailAddress?: string;
    phoneNumber?: string;
}

export interface BankDetailsUpdateDTO {
    account_number?: string;
    bank_branch_id?: number;
    currency_id?: number;
    effective_from_date?: string;
    effective_to_date?: string;
    iban?: string;
    id?: number;
    is_default_channel?: string;
    mpayno?: string;
    partyAccountId?: number;
    preferedChannel?: string;
  }

  export interface NextKinDetailsUpdateDTO {
    id?: number;
    fullName?: string;
    modeOfIdentityId?: number;
    identityNumber?: string;
    emailAddress?: string;
    phoneNumber?: string;
    smsNumber?: string;
    relationship?: string;
    accountId?: number;
  }

  export interface PersonalDetailsUpdateDTO {
    accountId?: number;
    dob?: string;
    emailAddress?: string;
    identityNumber?: string;
    modeOfIdentityId?: number;
    name?: string;
    occupationId?: number;
    organizationId?: number;
    passportNo?: string;
    phoneNumber?: string;
    physicalAddress?: string;
    pinNumber?: string;
    titleShortDescription?: string;
    title?: ClientTitleDTO;
    category?: string;
    departmentId?: number;
    supervisorId?: number;
  }

  export interface WealthDetailsUpdateDTO {
    citizenship_country_id?: number;
    funds_source?: string;
    id?: number;
    is_employed?: number;
    is_self_employed?: number;
    marital_status?: string;
    nationality_country_id?: number;
    occupation_id?: number;
    partyAccountId?: number;
    source_of_funds_id?: number;
    sector_id?: number,
  }

  export interface AmlWealthDetailsUpdateDTO {
    certificate_registration_number?: string,
    certificate_year_of_registration?: string,
    cr_form_required?: string,
    cr_form_year?: number,
    funds_source?: string,
    id?: number,
    operating_country_id?: number,
    parent_country_id?: number,
    partyAccountId?: number,
    registeredName?: string,
    source_of_wealth_id?: number,
    tradingName?: string
  }

  export interface AccountDetailsDTO {
    accountCode?: number,
    accountTypeId?: number,
    category?: string,
    effectiveDateFrom?: string,
    effectiveDateTo?: string,
    id?: number,
    kycInfo?: kycInfoDTO,
    organizationGroupId?: number,
    organizationId?: number,
    partyId?: number,
    partyType?: PartyTypeDto
  }

  //Party Accounts DTO using Account Id
  export interface PartyAccountsDetails {
    accountCode?: number,
    accountType?: number,
    address?: {
      account?: AccountDetailsDTO,
      box_number?: string,
      country_id?: number,
      estate?: string,
      fax?: string,
      house_number?: string,
      id?: number,
      is_utility_address?: string,
      phoneNumber?: string,
      physical_address?: string,
      postal_code?: string,
      residential_address?: string,
      road?: string,
      state_id?: number,
      town_id?: number,
      utility_address_proof?: string,
      zip?: string
    },
    agentDto?: AgentDTO,
    category?: string,
    clientDetails?: {
      clientBranchCode?: number,
      clientId?: number,
      titleDto?: string
    },
    clientDto?: {
      branchCode?: number,
      category?: string,
      clientTitle?: string,
      clientType?: {
        category?: string,
        clientTypeName?: string,
        code?: number,
        description?: string,
        organizationId?: number,
        person?: string,
        type?: string
      },
      country?: number,
      createdBy?: string,
      dateOfBirth?: string,
      emailAddress?: string,
      firstName?: string,
      gender?: string,
      id?: number,
      idNumber?: string,
      lastName?: string,
      modeOfIdentity?: string,
      occupation?: {
        id?: number,
        name?: string,
        sector_id?: number,
        short_description?: string
      },
      passportNumber?: string,
      phoneNumber?: string,
      physicalAddress?: string,
      pinNumber?: string,
      shortDescription?: string,
      status?: string,
      withEffectFromDate?: string
    },
    contactDetails?: {
      account?: AccountDetailsDTO,
      accountId?: number,
      emailAddress?: string,
      id?: number,
      phoneNumber?: string,
      preferredChannel?: string,
      receivedDocuments?: string,
      smsNumber?: string,
      title?: ClientTitleDTO;
      titleShortDescription?: string
    },
    country?: {
      id?: number,
      name?: string,
      short_description?: string
    },
    countryId?: number,
    createdBy?: string,
    dateCreated?: string,
    dateOfBirth?: string,
    effectiveDateFrom?: string,
    effectiveDateTo?: string,
    firstName?: string,
    gender?: string,
    id?: number,
    lastName?: string,
    modeOfIdentity?: IdentityModeDTO,
    modeOfIdentityNumber?: number,
    nextOfKinDetailsList?: [
      {
        account?: AccountDetailsDTO,
        emailAddress?: string,
        fullName?: string,
        id?: number,
        identityNumber?: string,
        modeOfIdentity?: {
          createdBy?: string,
          createdDate?: string,
          id?: number,
          identityFormat?: string,
          identityFormatError?: string,
          modifiedBy?: string,
          modifiedDate?: string,
          name?: string,
          orgCode?: number
        },
        phoneNumber?: string,
        relationship?: string,
        smsNumber?: string
      }
    ],
    organizationId?: number,
    partyId?: number,
    partyType?: PartyTypeDto,
    paymentDetails?: {
      account_number?: string,
      bank_branch_id?: number,
      currency_id?: number,
      effective_from_date?: string,
      effective_to_date?: string,
      iban?: string,
      id?: number,
      is_default_channel?: string,
      mpayno?: string,
      partyAccountId?: number,
      preferedChannel?: string
    },
    pinNumber?: string,
    serviceProviderDto?: {
      category?: string,
      country?: {
        id?: number,
        name?: string,
        short_description?: string
      },
      createdBy?: string,
      dateCreated?: string,
      dateOfRegistration?: string,
      effectiveDateFrom?: string,
      emailAddress?: string,
      gender?: string,
      id?: number,
      idNumber?: string,
      modeOfIdentity?: string,
      modeOfIdentityDto?: IdentityModeDTO,
      name?: string,
      organizationId?: number,
      parentCompany?: string,
      partyId?: number,
      phoneNumber?: string,
      physicalAddress?: string,
      pinNumber?: string,
      postalAddress?: string,
      providerLicenseNo?: string,
      providerStatus?: string,
      providerType?: {
        code?: number,
        name?: string,
        providerTypeSuffixes?: string,
        shortDescription?: string,
        shortDescriptionNextNo?: string,
        shortDescriptionSerialFormat?: string,
        status?: string,
        vatTaxRate?: string,
        witholdingTaxRate?: string
      },
      shortDescription?: string,
      smsNumber?: string,
      status?: string,
      system?: string,
      systemCode?: number,
      title?: string,
      tradeName?: string,
      type?: string,
      vatNumber?: string
    },
    status?: string,
    userDto?: StaffDto,
    wealthAmlDetails?: {
      certificate_registration_number?: string,
      certificate_year_of_registration?: string,
      citizenship_country_id?: number,
      cr_form_required?: number,
      cr_form_year?: number,
      distributeChannel?: string,
      funds_source?: string,
      id?: number,
      insurancePurpose?: string,
      is_employed?: string,
      is_self_employed?: string,
      marital_status?: string,
      nationality_country_id?: number,
      occupation_id?: number,
      operating_country_id?: number,
      parent_country_id?: number,
      partyAccountId?: number,
      premiumFrequency?: string,
      registeredName?: string,
      sector_id?: number,
      source_of_wealth_id?: number,
      tradingName?: string
    }
  }

export interface ClientTitleDTO {
    id: number,
    shortDescription: string,
    description: string,
    gender: string,
    organizationId: number
}
