//export type Roles = 'VISITATORE' | 'ADMIN' | 'TEORIA' | 'GUIDA';


export interface User {
  uid: string;
  email: string;
  displayName?: string;
  emailVerified: boolean;
  password?: string;
 // role?: Roles;
 /* phoneNumber: string; */
}
