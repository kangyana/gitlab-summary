import { atom } from 'jotai';
import type { User } from '@/types/user';

export const activeKeyAtom = atom('login');

export const userinfoAtom = atom<User>({
  id: 0,
  name: '游客',
  username: 'youke',
  avatar_url: '',
});
