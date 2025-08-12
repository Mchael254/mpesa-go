export interface OtpRequestPayload {
  recipient: string,
  purpose: string,
  channel: string
  otpCode: number,
}
