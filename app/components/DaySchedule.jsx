import { View, Text, ScrollView } from "react-native";
import dayjs from "dayjs";

export default function DaySchedule({ bookings }) {
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = 8 + Math.floor(i / 2); // 8–20
    const minutes = i % 2 === 0 ? "00" : "30";
    return `${hour}:${minutes}`;
  });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "black" }}>
      {timeSlots.map((slot, index) => {
        const [hour, minute] = slot.split(":").map(Number);

        const slotBookings = bookings.filter((b) => {
          const bookingTime = dayjs(b.time);
          return (
            bookingTime.hour() === hour && bookingTime.minute() === minute
          );
        });

        return (
          <View
            key={index}
            style={{
              height: 80,
              borderBottomColor: "#333",
              borderBottomWidth: 1,
              justifyContent: "center",
              paddingLeft: 10,
            }}
          >
            <Text style={{ color: "gray", fontSize: 12 }}>{slot}</Text>

            {slotBookings.map((b, i) => (
              <View
                key={i}
                style={{
                  position: "absolute",
                  left: 80,
                  right: 0,
                  top: 0,
                  height: 80,
                  backgroundColor: "#0f4e99",
                  justifyContent: "center",
                  paddingLeft: 10,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {b.client}
                </Text>
                <Text style={{ color: "white", fontSize: 12 }}>
                  {b.service}
                </Text>
              </View>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}