export class UserCredential {
  password!: string;
  username!: string;
}

export interface AuthenticationResponse {
  phoneNumber: string;
  emailAddress: string;
  sent?: boolean;
  locked?: boolean;
  accountStatus: boolean;
  allowMultifactor?: string;
}
