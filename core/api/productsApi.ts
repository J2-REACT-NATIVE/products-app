import { SecureStorageAdapter } from "@/helpers/adapters/secure-storage.adapters";
import { create } from "axios";

import { Platform } from "react-native";

// TODO: conectar mediante envs vars, Android e IOS

const STAGE = process.env.EXPO_PUBLIC_STAGE || "dev";

export const API_URL =
  STAGE === "prod"
    ? process.env.EXPO_PUBLIC_API_URL
    : Platform.OS === "ios"
      ? process.env.EXPO_PUBLIC_API_URL_IOS
      : process.env.EXPO_PUBLIC_API_URL_ANDROID;

console.log({ STAGE, [Platform.OS]: API_URL });
//! creamos el objeto de axios con el baseUrl
const productsApi = create({
  baseURL: API_URL,
});

//! este interceptor se va a ejecutar cada vez haya una request
//! usamos el objeto productsApi que es de tipo Axios
productsApi.interceptors.request.use(async (config) => {
  // Verificar si tenemos un token en el secure storage
  const token = await SecureStorageAdapter.getItem("token");

  if (token) {
    //!modificamos el objeto de configutracion de axios que se va a usar en la request
    config.headers.Authorization = `Bearer ${token}`;
  }
  //! si el token no existe se envia el config tal cual.
  return config;
});

export { productsApi };
