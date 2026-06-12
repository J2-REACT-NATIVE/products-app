import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect, Stack } from "expo-router";

import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { useThemeColor } from "@/presentation/theme/hooks/use-theme-color";
import LogoutIconButton from "@/presentation/auth/components/LogoutIconButton";
// import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor';
// import LogoutIconButton from '@/presentation/auth/components/LogoutIconButton';

const CheckAuthenticationLayout = () => {
  //! desestructuramos el AuthStore
  const { status, checkStatus } = useAuthStore();
  const backgroundColor = useThemeColor({}, "background");
  console.log({status:status})
  //!llamamos a checkstatus()
  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  if (status === "checking") {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 5,
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }
//! si el usuario no est aautenticado lo redireccionamos a auth/login
  if (status === "unauthenticated") {
    // Guardar la ruta del usuario
    return <Redirect href="/auth/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: backgroundColor,
        },
        contentStyle: {
          backgroundColor: backgroundColor,
        },
      }}
    >
      <Stack.Screen
        name="(home)/index"
        options={{
          title: "Productos",
          headerLeft: () => <LogoutIconButton />,
          //headerLeft: () => <Text>LogoutIconButton</Text>,
        }}
      />
      <Stack.Screen
        name="(home)/product/[id]"
        options={{
          title: "Producto"
          }}
      />
    </Stack>
  );
};
export default CheckAuthenticationLayout;
