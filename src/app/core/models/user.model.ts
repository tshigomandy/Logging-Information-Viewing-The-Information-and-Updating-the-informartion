export enum User_Roles {
  Manager = 0,
  User = 1,
  Technician = 2
}

export interface UserRole {
  id: number;
  description: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roleId: number;
  user_Roles: UserRole;
}
