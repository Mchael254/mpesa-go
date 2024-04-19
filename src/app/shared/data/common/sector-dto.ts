export interface SectorDTO {
  assignedOccupations: [
    {
      occupationId: number;
      occupationName: string;
      sectorId: number;
      sectorName: string;
      wefDate: string;
      wetDate: string;
    }
  ];
  id: number;
  shortDescription: string;
  name: string;
  sectorWefDate: string;
  sectorWetDate: string;
  organizationId: number;
}

export interface AssignOccupationDTO {
  occupationId: number;
  sectorId: number;
  wefDate: string;
  wetDate: string;
}

export interface PostSectorDTO {
  assignedOccupations: AssignOccupationDTO[];
  id: number;
  name: string;
  organizationId: number;
  sectorWefDate: string;
  sectorWetDate: string;
  shortDescription: string;
}
