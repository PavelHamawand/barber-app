import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  PanResponder,
} from "react-native";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import advancedFormat from "dayjs/plugin/advancedFormat";
import "dayjs/locale/sv";

dayjs.extend(isoWeek);
dayjs.extend(advancedFormat);
dayjs.locale("sv");

const weekdayNames = ["M", "T", "O", "T", "F", "L", "S"];

export default function CalendarHeader({ selectedDate, setSelectedDate }) {
  const selected = dayjs(selectedDate); // ✅ Konvertera inkommande JS Date till dayjs

  const today = dayjs();
  const thisWeek = today.isoWeek();
  const currentYear = today.year();

  const startOfWeek = selected.isoWeekday(1); // måndag
  const weekDays = Array.from({ length: 7 }).map((_, i) =>
    startOfWeek.add(i, "day")
  );

  const handleDatePress = (date) => {
    setSelectedDate(date.toDate()); // Skicka som JS Date tillbaka till Schedule
  };

  const canGoToWeek = (newDate) => {
    const week = newDate.isoWeek();
    const year = newDate.year();
    return (
      (year === currentYear && Math.abs(week - thisWeek) <= 1) ||
      (year > currentYear && thisWeek === 52 && week === 1) ||
      (year < currentYear && thisWeek === 1 && week === 52)
    );
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 20,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50) {
          // Swipe höger – gå en vecka bak
          const newDate = selected.subtract(1, "week");
          if (canGoToWeek(newDate)) {
            setSelectedDate(newDate.toDate());
          }
        } else if (gestureState.dx < -50) {
          // Swipe vänster – gå en vecka fram
          const newDate = selected.add(1, "week");
          if (canGoToWeek(newDate)) {
            setSelectedDate(newDate.toDate());
          }
        }
      },
    })
  ).current;

  return (
    <View
      style={{ padding: 16, backgroundColor: "black" }}
      {...panResponder.panHandlers}
    >
      {/* Månad */}
      <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
        {startOfWeek.format("MMMM")}
      </Text>

      {/* Veckodagar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 20 }}
      >
        {weekDays.map((date, index) => {
          const isSelected = date.isSame(selected, "day");
          return (
            <TouchableOpacity key={index} onPress={() => handleDatePress(date)}>
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: "white", fontSize: 14 }}>
                  {weekdayNames[index]}
                </Text>
                <View
                  style={{
                    marginTop: 4,
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: isSelected ? "#0f4e99" : "transparent",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: isSelected ? "white" : "grey",
                      fontSize: 16,
                    }}
                  >
                    {date.date()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Vald dag */}
      <Text
        style={{
          textAlign: "center",
          marginTop: 16,
          color: "white",
          fontSize: 18,
        }}
      >
        {selected.format("dddd D MMMM")}
      </Text>
    </View>
  );
}