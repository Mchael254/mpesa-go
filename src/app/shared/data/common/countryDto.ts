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
