export type Roles = 'ADMIN' | 'USER';

export class User {
  uid: string;
  email: string;
  displayName?: string;
  emailVerified: boolean;
  password?: string;
  role?: Roles;
  location?: any;
  latitude?: any;
  longitude?: any;
  ssid? : string;
  idFamiglia? : string;


  constructor(user?: any) {
    user = user ? user : {};
    this.uid = user.uid;
    this.displayName = user.displayName;
    this.emailVerified= user.emailVerified;
    this.idFamiglia= user.idFamiglia;
    this.email = user.email;
    this.role = user.role;
    this.location = user.location;
    this.latitude = user.latitude;
    this.longitude = user.longitude;
    this.ssid=user.ssid;
  
}
}