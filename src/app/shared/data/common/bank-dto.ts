export interface BankDTO {
    countryId: number,
    id: number,
    name: string,
    short_description: string
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
    symbol: string
}