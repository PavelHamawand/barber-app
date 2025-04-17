import React, { useRef, useMemo } from "react";
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
  const selected = useMemo(() => dayjs(selectedDate), [selectedDate]);
  const startOfWeek = useMemo(() => selected.isoWeekday(1), [selected]);

  const weekDays = useMemo(
    () => Array.from({ length: 7 }).map((_, i) => startOfWeek.add(i, "day")),
    [startOfWeek]
  );

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 20,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50) {
          setSelectedDate((prev) => dayjs(prev).subtract(1, "week").toDate());
        } else if (gestureState.dx < -50) {
          setSelectedDate((prev) => dayjs(prev).add(1, "week").toDate());
        }
      },
    })
  ).current;

  const handleDatePress = (date) => {
    setSelectedDate(date.toDate());
  };

  return (
    <View
      style={{ padding: 16, backgroundColor: "black" }}
      {...panResponder.panHandlers}
    >
      {/* Månad */}
      <Text
        style={{
          color: "white",
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 12,
        }}
      >
        {startOfWeek.format("MMMM")}
      </Text>

      {/* Veckodagar med ScrollView */}
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