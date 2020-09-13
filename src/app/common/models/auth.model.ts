
export class StatusRequest {
  status: boolean;
  message: string;
}
export class UserModel {
  uid: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
  accessToken: string;
  phoneNumber: string;
  expirationTime: string;
}
