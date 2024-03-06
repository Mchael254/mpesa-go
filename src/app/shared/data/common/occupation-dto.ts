export interface OccupationDTO {
  id: number;
  shortDescription: string;
  name: string;
  wefDate: string;
  wetDate: string;
  organizationId: number;
}

export interface OccupationSectorDTO {
  occupationId: Number;
  sectorId: number;
  wefDate: string;
  wetDate: string;
}
