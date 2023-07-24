export interface BankDTO {
    countryId: number,
    id: number,
    name: string,
    short_description: string
}

export interface BankBranchDTO {
    bank_id: number,
    createdBy: string,
    id: number,
    name: string,
    short_description: string
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