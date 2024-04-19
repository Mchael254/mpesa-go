export interface OccupationDTO {
  assignedSectors: AssignedSectorDTO[];
  id: number;
  shortDescription: string;
  name: string;
  wefDate: string;
  wetDate: string;
  organizationId: number;
}

export interface AssignedSectorDTO {
  occupationId: number;
  occupationName: string;
  sectorId: number;
  sectorName: string;
  wefDate: string;
  wetDate: string;
}

export interface AssigSectorDTO {
  occupationId: number;
  sectorId: number;
  wefDate: string;
  wetDate: string;
}

export interface PostOccupationDTO {
  assignedSectors: AssigSectorDTO[];
  id: number;
  name: string;
  organizationId: number;
  shortDescription: string;
  wefDate: string;
  wetDate: string;
}

export interface OccupationSectorDTO {
  occupationId: Number;
  sectorId: number;
  wefDate: string;
  wetDate: string;
}
