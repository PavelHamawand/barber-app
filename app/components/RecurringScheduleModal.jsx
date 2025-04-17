import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

const weekdays = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"];

export default function RecurringScheduleModal({ visible, onClose, onSave }) {
  const [selectedDays, setSelectedDays] = useState([]);

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, backgroundColor: "#000000aa", justifyContent: "center", alignItems: "center" }}>
        <View style={{ backgroundColor: "#1e1e1e", padding: 20, borderRadius: 10, width: "80%" }}>
          <Text style={{ color: "white", fontSize: 18, marginBottom: 10 }}>Välj dina arbetsdagar:</Text>
          {weekdays.map((day, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => toggleDay(index)}
              style={{
                backgroundColor: selectedDays.includes(index) ? "#0f4e99" : "#2a2a2a",
                padding: 10,
                borderRadius: 6,
                marginVertical: 4,
              }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>{day}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => {
              onSave(selectedDays);
              onClose();
            }}
            style={{ backgroundColor: "#2f80ed", padding: 10, borderRadius: 6, marginTop: 15 }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>Spara</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={{ marginTop: 10 }}>
            <Text style={{ color: "#aaa", textAlign: "center" }}>Avbryt</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}