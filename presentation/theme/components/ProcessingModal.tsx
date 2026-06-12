import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";

import { ThemedText } from "./themed-text";
import { useThemeColor } from "../hooks/use-theme-color";

interface Props {
  visible: boolean;
  title: string;
  message?: string;
}

const ProcessingModal = ({ visible, title, message }: Props) => {
  const primaryColor = useThemeColor({}, "primary");
  const backgroundColor = useThemeColor({}, "background");

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      statusBarTranslucent
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor }]}>
          <ActivityIndicator size="large" color={primaryColor} />

          <ThemedText type="subtitle" style={styles.title}>
            {title}
          </ThemedText>

          {message ? (
            <ThemedText style={styles.message}>{message}</ThemedText>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

export default ProcessingModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  card: {
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 24,
    paddingVertical: 28,
    borderRadius: 18,
  },
  title: {
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    opacity: 0.75,
  },
});
