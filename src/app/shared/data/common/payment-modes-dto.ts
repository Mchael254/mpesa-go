export interface PaymentModesDto {
  description: string,
  id: number,
  isDefault: string,
  narration: string,
  organizationId: number,
  shortDescription: string
}

export interface ClaimsPaymentModesDto {
  description: string,
  id: number,
  isDefault: string,
  maximumAmount: number,
  minimumAmount: number,
  organizationId: number,
  remarks: string,
  shortDescription: string
}
