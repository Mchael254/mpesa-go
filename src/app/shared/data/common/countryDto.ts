export interface CountryDto {
  adminRegMandatory: string;
  adminRegType: string;
  currSerial: number;
  currency: {
    createdBy: string;
    createdDate: string;
    decimalWord: string;
    id: number;
    modifiedBy: string;
    modifiedDate: string;
    name: string;
    numberWord: string;
    roundingOff: number;
    symbol: string;
  };
  drugTraffickingStatus: string;
  drugWefDate: string;
  drugWetDate: string;
  highRiskWefDate: string;
  highRiskWetDate: string;
  id: number;
  isShengen: string;
  mobilePrefix: number;
  name: string;
  nationality: string;
  risklevel: string;
  short_description: string;
  subAdministrativeUnit: string;
  telephoneMaximumLength: number;
  telephoneMinimumLength: number;
  unSanctionWefDate: string;
  unSanctionWetDate: string;
  unSanctioned: string;
  zipCode: number;
  zipCodeString: string;
}
export interface StateDto {
  country: CountryDto;
  id: number;
  shortDescription: string;
  name: string;
}
export interface TownDto {
  id: number;
  country: CountryDto;
  shortDescription: string;
  name: string;
  state: StateDto;
}

// export interface CountryDTO {
//   adminRegMandatory: string;
//   adminRegType: string;
//   currSerial: number;
//   currency: {
//     createdBy: string;
//     createdDate: string;
//     decimalWord: string;
//     id: number;
//     modifiedBy: string;
//     modifiedDate: string;
//     name: string;
//     numberWord: string;
//     roundingOff: number;
//     symbol: string;
//   };
//   drugTraffickingStatus: string;
//   drugWefDate: string;
//   drugWetDate: string;
//   highRiskWefDate: string;
//   highRiskWetDate: string;
//   id: number;
//   isShengen: string;
//   mobilePrefix: number;
//   name: string;
//   nationality: string;
//   risklevel: string;
//   short_description: string;
//   subAdministrativeUnit: string;
//   telephoneMaximumLength: number;
//   telephoneMinimumLength: number;
//   unSanctionWefDate: string;
//   unSanctionWetDate: string;
//   unSanctioned: string;
//   zipCode: number;
//   zipCodeString: string;
// }

export interface PostCountryDTO {
  adminRegMandatory: string;
  adminRegType: string;
  currSerial: number;
  currency: number;
  drugTraffickingStatus: string;
  drugWefDate: string;
  drugWetDate: string;
  highRiskWefDate: string;
  highRiskWetDate: string;
  id: number;
  isShengen: string;
  mobilePrefix: number;
  name: string;
  nationality: string;
  risklevel: string;
  short_description: string;
  subAdministrativeUnit: string;
  telephoneMaximumLength: number;
  telephoneMinimumLength: number;
  unSanctionWefDate: string;
  unSanctionWetDate: string;
  unSanctioned: string;
  zipCode: number;
  zipCodeString: string;
}

// export interface StateDTO {
//   country: CountryDTO;
//   id: number;
//   name: string;
//   shortDescription: string;
// }

export interface PostStateDTO {
  countryId: number;
  id: number;
  name: string;
  shortDescription: string;
}

export interface PostTownDTO {
  countryId: number;
  id: number;
  name: string;
  shortDescription: string;
  stateId: number;
}

export interface AdminstrativeUnitDTO {
  id: string;
  name: string;
}

export interface SubadminstrativeUnitDTO {
  id: string;
  name: string;
}

export interface SubCountyDTO {
  countryCode: number;
  id: number;
  name: string;
  shortDescription: string;
  stateCode: number;
}

export interface CountryHolidayDTO {
  countryCode: number;
  countryName: string;
  day: number;
  description: string;
  id: number;
  month: number;
  status: string;
}

export interface PostCountryHolidayDTO {
  countryCode: number;
  day: number;
  description: string;
  id: number;
  month: number;
  status: string;
}

export interface PostalCodesDTO {
  description: string,
  id: number,
  townCode: number,
  townName: number,
  zipCode: number
}
