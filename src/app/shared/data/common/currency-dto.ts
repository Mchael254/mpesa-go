export interface CurrencyDTO {
  decimalWord: string,
  id: number,
  name: string,
  numberWord: string,
  roundingOff: number,
  symbol: string
}

export interface CurrencyRateDTO {
  baseCurrencyId: number,
  date: string,
  id: number,
  organizationId: number,
  rate: number,
  targetCurrencyId: number,
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
