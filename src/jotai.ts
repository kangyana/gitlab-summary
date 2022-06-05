import { atom } from 'jotai';
import type { User } from '@/types/user';

export const activeKeyAtom = atom('login');

export const userinfoAtom = atom<User>({ username: '游客' });