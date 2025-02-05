export interface SystemsDto {
  id: number;
  shortDesc: string;
  systemName: string;
}

export interface StatusDTO {
  name: string;
  value: string;
}

export interface SystemModule {
  id: number;
  shortDescription: string;
  description: string;
  systemId: number;
  systemName: string;
}

export interface SystemReportModule {
  id: number;
  name: string;
  description: string;
  systemCode: number;
  system: SystemsDto;
}
