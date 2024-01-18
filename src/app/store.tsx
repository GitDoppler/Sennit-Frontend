import { create } from 'zustand'

type State = {
  username: string
  roles: Array<string>
}

type Action = {
  updateUsername: (firstName: State['username']) => void
  updateRoles: (lastName: State['roles']) => void
}

export const useUserStore = create<State & Action>((set) => ({
  username: '',
  roles: [],
  updateUsername: (username) => set(() => ({ username: username })),
  updateRoles: (roles) => set(() => ({ roles: roles })),
}))