import { View, Text, ScrollView } from "react-native";
import dayjs from "dayjs";

// Lista med olika blåa nyanser
const blueShades = ["#0f4e99", "#1a66cc", "#2f80ed", "#145c9e"];

export default function DaySchedule({ bookings, selectedDate }) {
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = 8 + Math.floor(i / 2);
    const minutes = i % 2 === 0 ? "00" : "30";
    return `${hour}:${minutes}`;
  });

  // Håller koll på senaste färgen för att undvika repetition
  let lastColorIndex = -1;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "black" }}>
      {timeSlots.map((slot, index) => {
        const [hour, minute] = slot.split(":").map(Number);

        const slotBookings = bookings.filter((b) => {
          const fullDateTime = dayjs(
            dayjs(selectedDate).format("YYYY-MM-DD") + "T" + b.time_slot
          );
          return fullDateTime.hour() === hour && fullDateTime.minute() === minute;
        });

        return (
          <View
            key={index}
            style={{
              height: 80,
              flexDirection: "row",
              alignItems: "flex-start",
              paddingTop: 3,
              paddingLeft: 10,
              position: "relative",
            }}
          >
            {/* Tid */}
            <View style={{ width: 50, alignItems: "flex-end", paddingRight: 5 }}>
              <Text style={{ color: "gray", fontSize: 12, fontWeight: "bold" }}>{slot}</Text>
            </View>

            {/* Horisontell linje */}
            <View
              style={{
                height: 1,
                backgroundColor: "#333",
                flex: 1,
                marginTop: 7,
              }}
            />

            {/* Bokningsblock */}
            {slotBookings.map((b, i) => {
              // Slumpmässigt välj färg som inte är samma som förra
              let colorIndex;
              do {
                colorIndex = Math.floor(Math.random() * blueShades.length);
              } while (colorIndex === lastColorIndex && blueShades.length > 1);
              lastColorIndex = colorIndex;

              return (
                <View
                  key={i}
                  style={{
                    position: "absolute",
                    left: 80,
                    right: 0,
                    top: 11,
                    height: 78,
                    backgroundColor: blueShades[colorIndex],
                    justifyContent: "center",
                    paddingLeft: 10,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    {b.customer_name}
                  </Text>
                  <Text style={{ color: "white", fontSize: 12 }}>
                    {b.service?.name ?? "Okänd tjänst"}
                  </Text>
                </View>
              );
            })}
          </View>
        );
      })}
    </ScrollView>
  );
}