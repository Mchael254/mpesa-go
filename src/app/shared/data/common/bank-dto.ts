export interface BankDTO {
  administrativeCharge: number,
  allowPesalink: string,
  bankAccountNoCharacters: number,
  bankLogo: string,
  bankSortCode: string,
  bankType: string,
  countryId: number,
  countryName: string,
  ddiCharge: number,
  directDebitFormat: string,
  directDebitReportCode: number,
  forwardingBankId: number,
  forwardingBankName: string,
  hasParentBank: string,
  id: number,
  isDirectDebitSupported: string,
  isEftSupported: string,
  isForwardingBank: string,
  isNegotiatedBank: string,
  maximumAccountNoCharacters: string,
  minimumAccountNoCharacters: string,
  name: string,
  parentBankId: number,
  parentBankName: string,
  physicalAddress: string,
  remarks: string,
  short_description: string,
  status: string,
  withEffectiveFrom: string,
  withEffectiveTo: string
}

// export interface BankBranchDTO {
//     bank_id: number,
//     createdBy: string,
//     id: number,
//     name: string,
//     short_description: string
// }

export interface BankBranchDTO {
    bankId: number,
    bankName: string,
    branchCode: number,
    branchName: string,
    contactPersonEmail: string,
    contactPersonName: string,
    contactPersonPhone: string,
    countryCode: number,
    countryName: string,
    createdBy: string,
    createdDate: string,
    directDebitSupported: string,
    eftSupported: string,
    email: string,
    id: number,
    name: string,
    physicalAddress: string,
    postalAddress: string,
    referenceCode: string,
    short_description: string,
    townCode: number,
    townName: string
}

export interface POSTBankBranchDTO {
  bankId: number,
  branchCode: number,
  branchName: string,
  contactPersonEmail: string,
  contactPersonName: string,
  contactPersonPhone: string,
  countryCode: number,
  directDebitSupported: string,
  eftSupported: string,
  email: string,
  id: number,
  name: string,
  physicalAddress: string,
  postalAddress: string,
  referenceCode: string,
  short_description: string,
  townCode: number,
}

export interface BankChargeDTO {
  bankCode: number,
  bankName: string,
  dateFrom: string,
  dateTo: string,
  id: number,
  productCode: number,
  productName: string,
  rate: number,
  rateType: string,
  systemCode: number,
  systemName: string
}
export interface BankRegionDTO {
    bankRegionName: string,
    id: number,
    managerId: number,
    organizationId: number,
    regionCode: number,
    shortDescription: string,
    wef: string,
    wet: string
}

export interface FundSourceDTO {
    code: number,
    name: string
}

export interface CurrencyDTO {
  decimalWord: string,
  id: number,
  name: string,
  numberWord: string,
  roundingOff: number,
  symbol: string,
  nameAndSymbol?: string
}
