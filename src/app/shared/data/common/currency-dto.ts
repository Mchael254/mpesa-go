export interface CurrencyDTO {
  decimalWord: string,
  currencyDefault?:'Y' | 'N' ,
  id: number,
  name: string,
  nameAndSymbol?: string,
  numberWord: string,
  roundingOff: number,
  symbol: string
}

export interface CurrencyRateDTO {
  baseCurrency?: string,
  baseCurrencyId: number,
  date: string,
  id: number,
  organizationId: number,
  rate: number,
  targetCurrencyId: number,
  targetCurrency?: string,
  withEffectFromDate: string,
  withEffectToDate: string
}

export interface CurrencyDenominationDTO {
  currencyCode: number,
  currencyName: string,
  id: number,
  name: string,
  value: string,
  withEffectiveFrom: string
}
