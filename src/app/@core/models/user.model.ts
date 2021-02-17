export type Roles = 'ADMIN' | 'USER';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  emailVerified: boolean;
  password?: string;
  role?: Roles;
  location?: any;
  ssid? : string;
  address? : string;
  idFamiglia? : string;
}