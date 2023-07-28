export interface AuthVerification {
  name: string;
  type: string;
  icon: string;
  selected?: boolean;
}

export interface AccountVerifiedResponse {
  message?: string,
  status?: string
}

export const accountType: AuthVerification[] = [
  {
  name: "7*******89",
  type: "Via sms:",
  icon: "smartphone-outline",
  selected: true
  },
  {
  name: "ra*******@gmail.com",
  type: "Via email:",
  icon: "email-outline",
  },
]
