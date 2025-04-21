import { Modal, View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CustomerModal({ customer, visible, onClose }) {
  if (!customer) return null;

  const handleCall = () => {
    if (customer.number) {
      Linking.openURL(`tel:${customer.number}`);
    }
  };

  const handleEmail = () => {
    if (customer.email) {
      Linking.openURL(`mailto:${customer.email}`);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.name}>{customer.name}</Text>

          <View style={styles.contactContainer}>
            <TouchableOpacity onPress={handleCall} style={styles.row}>
              <Ionicons name="call-outline" size={20} color="#ccc" style={styles.icon} />
              <Text style={styles.info}>{customer.number}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleEmail} style={styles.row}>
              <Ionicons name="mail-outline" size={20} color="#ccc" style={styles.icon} />
              <Text style={styles.info}>{customer.email}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Stäng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "85%",
    backgroundColor: "#121212",
    borderRadius: 15,
    paddingVertical: 25,
    paddingHorizontal: 20,
  },
  name: {
    color: "darkgray",
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 25,
  },
  contactContainer: {
    gap: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 12,
    color: "white"
  },
  info: {
    color: "#2f80ed",
    fontSize: 16,
  },
  closeButton: {
    alignSelf: "center",
    marginTop: 30,
    backgroundColor: "#0f4e99",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  closeText: {
    color: "white",
    fontSize: 16,
  },
});