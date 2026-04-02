import Colors from "@/src/constants/Colors";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
type Props = {
  onAuthenticate: () => void;
};

export const MustLogin = ({ onAuthenticate }: Props) => {
  const colors = Colors[useColorScheme()];
  let theme = useColorScheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Icono */}
      <View style={styles.iconContainer}>
        <Ionicons name="finger-print" size={80} color={colors.tint} />
      </View>

      {/* Título */}
      <Text style={[styles.title, { color: colors.text }]}>
        Authentication required
      </Text>

      {/* Descripción */}
      <Text style={[styles.description, { color: colors.text }]}>
        To continue, you need to authenticate using your fingerprint or
        biometrics. This option is enabled in the app settings.
      </Text>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={onAuthenticate}>
        <Ionicons name="lock-open" size={20} color="#fff" />
        <Text style={styles.buttonText}>Unlock</Text>
      </TouchableOpacity>

      {/* Footer */}
      <Text style={styles.footer}>
        Your information remains secure on your device
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  iconContainer: {
    padding: 25,
    borderRadius: 100,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    gap: 10,
    shadowColor: "#4F46E5",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
  },
});
