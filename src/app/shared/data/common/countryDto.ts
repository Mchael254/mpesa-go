export interface CountryDto {
  id: number,
  short_description: string,
  name: string
}
export interface StateDto {
  id: number,
  shortDescription: string,
  name: string,
  country: CountryDto
}
export interface TownDto{
  id:number,
  country: CountryDto,
  shortDescription: string,
  name: string,
  state: StateDto
}

export interface CountryDTO {
  adminRegMandatory: string,
  adminRegType: string,
  currSerial: number,
  currency: {
    createdBy: string,
    createdDate: string,
    decimalWord: string,
    id: number,
    modifiedBy: string,
    modifiedDate: string,
    name: string,
    numberWord: string,
    roundingOff: number,
    symbol: string
  },
  drugTraffickingStatus: string,
  drugWefDate: string,
  drugWetDate: string,
  highRiskWefDate: string,
  highRiskWetDate: string,
  id: number,
  isShengen: string,
  mobilePrefix: number,
  name: string,
  nationality: string,
  risklevel: string,
  short_description: string,
  telephoneMaximumLength: number,
  telephoneMinimumLength: number,
  unSanctionWefDate: string,
  unSanctionWetDate: string,
  unSanctioned: string,
  zipCode: number
}

export interface PostCountryDTO {
  adminRegMandatory: string,
  adminRegType: string,
  currSerial: number,
  currency: number,
  drugTraffickingStatus: string,
  drugWefDate: string,
  drugWetDate: string,
  highRiskWefDate: string,
  highRiskWetDate: string,
  id: number,
  isShengen: string,
  mobilePrefix: number,
  name: string,
  nationality: string,
  risklevel: string,
  short_description: string,
  telephoneMaximumLength: number,
  telephoneMinimumLength: number,
  unSanctionWefDate: string,
  unSanctionWetDate: string,
  unSanctioned: string,
  zipCode: number
}

export interface StateDTO {
  country: CountryDTO,
  id: number,
  name: string,
  shortDescription: string
}

export interface PostStateDTO {
  countryId: number,
  id: number,
  name: string,
  shortDescription: string
}

export interface PostTownDTO {
  countryId: number,
  id: number,
  name: string,
  shortDescription: string,
  stateId: number
}
