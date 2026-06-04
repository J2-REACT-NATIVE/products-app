
import { View, Text } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/presentation/theme/hooks/use-theme-color';
const LogoutIconButton = () => {
  const primaryColor = useThemeColor({}, 'primary');
  //! llamamos el metodo logout() que est en el Store
  const { logout } = useAuthStore();

  return (
    <TouchableOpacity style={{ marginRight: 8 }} onPress={logout}>
      <Ionicons name="log-out-outline" size={24} color={primaryColor} />
    </TouchableOpacity>
  );
};
export default LogoutIconButton;