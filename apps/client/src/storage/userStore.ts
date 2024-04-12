import { User } from '@libs/core/database/entities';
import { createEvent, createStore } from 'effector';

export type UserNullable = User | null;

export const setUser = createEvent<UserNullable>();
export const userStore = createStore<UserNullable>(null);

userStore.on(setUser, (store: UserNullable, user: UserNullable) => user);
