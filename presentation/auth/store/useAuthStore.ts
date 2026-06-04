import { create } from "zustand";

// import { authCheckStatus, authLogin } from '@/core/auth/actions/auth-actions';
// import { SecureStorageAdapter } from '@/helpers/adapters/secure-storage.adapter';
import { User } from "@/core/auth/interfaces/user";
import { authCheckStatus, authLogin } from "@/core/auth/actions/auth-actios";
import { SecureStorageAdapter } from "@/helpers/adapters/secure-storage.adapters";

export type AuthStatus = "authenticated" | "unauthenticated" | "checking";

export interface AuthState {
  status: AuthStatus;
  token?: string;
  user?: User;

  login: (email: string, password: string) => Promise<boolean>;
  checkStatus: () => Promise<void>;
  logout: () => Promise<void>;

  changeStatus: (token?: string, user?: User) => Promise<boolean>;
}

//! Creamos el objeto del Store de tipo AuthState
export const useAuthStore = create<AuthState>()((set, get) => ({
  // Properties
  status: "checking",
  token: undefined, //Opcional
  user: undefined, //Opcional

  // Actions
  //!Este es un metodo centralizado que sirve para actualizar el estado con el metodo set({})
  changeStatus: async (token?: string, user?: User) => {
    if (!token || !user) {
      set({ status: "unauthenticated", token: undefined, user: undefined });
      await SecureStorageAdapter.deleteItem('token');
      return false;
    }

    set({
      status: "authenticated",
      token: token,
      user: user,
    });
    //! una vez autenticado y verificado guardamos el token en el secure storage
    await SecureStorageAdapter.setItem('token', token);

    return true;
  },

  login: async (email: string, password: string) => {
    const resp = await authLogin(email, password);
    //! Con get tenemos acceso a todas las propiedades y metodos del state de manera interna
    //! Aqui usamos return porque tenemos que devolver el boolean true o false
    return await get().changeStatus(resp?.token, resp?.user);
  },

  checkStatus: async () => {
    //if(get().user) return
    const resp = await authCheckStatus();
    //! no usamos return porque esta funcion retorna void
    get().changeStatus(resp?.token, resp?.user);
  },

  logout: async () => {
    SecureStorageAdapter.deleteItem('token');
    //! Cambiamos el state
    set({ status: "unauthenticated", token: undefined, user: undefined });
  },
}));
