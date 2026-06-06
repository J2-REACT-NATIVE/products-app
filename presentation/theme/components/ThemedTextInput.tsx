import { Ionicons } from "@expo/vector-icons";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";

import { useRef, useState } from "react";
import { useThemeColor } from "../hooks/use-theme-color";

interface Props extends Omit<TextInputProps, "style"> {
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
}

const ThemedTextInput = ({ icon, style, ...rest }: Props) => {
  const primaryColor = useThemeColor({}, "primary");
  const textColor = useThemeColor({}, "text");

  const [isActive, setIsActive] = useState(false);
  // el inputRef es de tipo TextInput
  const inputRef = useRef<TextInput>(null);

  return (
    <View
      style={[
        {
          ...styles.border,
          //se define el color del borde del view segun el state isActive
          borderColor: isActive ? primaryColor : "#ccc",
        },
        style,
      ]}
      // Apenas se toca el view se dispara este evento y se establece el foco en el input si es que tiene un valor gracias al inputRef
      onTouchStart={() => inputRef.current?.focus()}
    >
      {/* Si tenemos el icono lo renderizamos segun el icon que vino por las props */}
      {icon && (
        <Ionicons
          name={icon}
          size={24}
          color={textColor}
          style={{ marginRight: 10 }}
        />
      )}

      <TextInput
        ref={inputRef}
        placeholderTextColor="#5c5c5c"
        //cuando tiene el foco
        onFocus={() => setIsActive(true)}
        //cuando pierde el foco
        onBlur={() => setIsActive(false)}
        style={{
          color: textColor,
          marginRight: 10,
          flex: 1,
        }}
        {...rest}
      />
    </View>
  );
};
export default ThemedTextInput;

const styles = StyleSheet.create({
  border: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});
