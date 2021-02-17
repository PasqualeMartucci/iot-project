import { User } from './user.model';

export class RoleValidator {

  isAdmin(user: User): boolean {
    return user.role === 'ADMIN';
  }
 

}

