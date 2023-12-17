import { Role } from 'src/users/enums/role.enum';

export interface ActiveUserData {
  /**
   * The "subject" of token. The value of this property is user ID
   * that granted token
   */
  sub: number;

  /**
   * The subject's(user) email
   */
  email: string;

  role: Role;
}
