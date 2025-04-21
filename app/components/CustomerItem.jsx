import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function CustomerItem({ customer, onPress }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.name}>{customer.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  name: {
    color: "white",
    fontSize: 18,
  },
});