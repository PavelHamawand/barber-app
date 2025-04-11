import { Text, TouchableOpacity } from "react-native";

export default function PrimaryButton({ title, onPress }) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#0f4e99",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 5,
        marginTop: 20,
        marginBottom: 150
        
      }}
      onPress={onPress}
    >
      <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>{title}</Text>
    </TouchableOpacity>
  );
}