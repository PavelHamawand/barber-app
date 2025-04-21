import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Settings() {
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert("Logga ut", "Är du säker på att du vill logga ut?", [
      {
        text: "Avbryt",
        style: "cancel",
      },
      {
        text: "Logga ut",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("barber");
            router.replace("/"); 
          } catch (error) {
            console.error("Fel vid utloggning:", error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Inställningar</Text>

      {/* Placeholder för framtida inställningar */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>🔧 Kommande inställningar...</Text>
      </View>

      <View style={{ flex: 1 }} />

      {/* Logga ut-knapp längst ner */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logga ut</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  heading: {
    color: "white",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 30,
  },
  settingItem: {
    paddingVertical: 15,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
  },
  settingText: {
    color: "#ccc",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#2f80ed",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});