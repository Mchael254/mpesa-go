export interface ParameterDto {
  description?: string;
  id: number;
  name: string;
  organizationId?: number;
  parameterError?: string;
  status?: string;
  value: string;
}
