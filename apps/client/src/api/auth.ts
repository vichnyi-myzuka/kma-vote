import axios from 'axios';
import { User } from '@libs/core/database/entities';
import { Role } from '@libs/core/database/enums';
import { UserNullable } from '../storage';

export async function getMe(): Promise<User | null> {
  try {
    return (await axios.get(`/auth/me`)).data;
  } catch (e) {
    return null;
  }
}

export function isAuthenticated(user: UserNullable): boolean {
  return user !== null;
}

export function isAdmin(user: UserNullable): boolean {
  return (isAuthenticated(user) && user?.roles.includes(Role.Admin)) || false;
}
