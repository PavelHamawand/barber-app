import { View, Text, TouchableOpacity, ScrollView } from "react-native";

export default function DayAvailability({ availability = {}, selectedDate, onToggle }) {
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = 12 + Math.floor(i / 2);
    const paddedHour = hour.toString().padStart(2, "0");
    const minutes = i % 2 === 0 ? "00" : "30";
    return `${paddedHour}:${minutes}`;
  });

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "black" }}
      contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 20 }}
    >
      {timeSlots.map((slot, index) => {
        const isAvailable = availability?.[slot] ?? false;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => onToggle && onToggle(slot)}
            style={{
              height: 60,
              backgroundColor: isAvailable ? "#0f4e99" : "#1e1e1e",
              borderColor: isAvailable ? "#2f80ed" : "#444",
              borderWidth: 1,
              borderRadius: 8,
              justifyContent: "center",
              paddingHorizontal: 15,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>
              {slot} – {isAvailable ? "Tillgänglig" : "Blockerad"}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}