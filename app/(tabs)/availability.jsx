import { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import CalendarHeader from "@/app/components/CalendarHeader.jsx";
import DayAvailability from "@/app/components/DayAvailability.jsx";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Availability() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [barberId, setBarberId] = useState(null);

  useEffect(() => {
    const fetchBarberId = async () => {
      try {
        const barber = await AsyncStorage.getItem("barber");
        if (barber) {
          const barberData = JSON.parse(barber);
          setBarberId(barberData.id);
        }
      } catch (error) {
        console.error("Fel vid hämtning av barber-id:", error);
      }
    };

    fetchBarberId();
  }, []);

  useEffect(() => {
    if (!barberId) return;

    const fetchAvailability = async () => {
      setLoading(true);
      const formattedDate = format(selectedDate, "yyyy-MM-dd");

      const savedAvailability = await AsyncStorage.getItem(`availability-${formattedDate}`);
      if (savedAvailability) {
        const parsed = JSON.parse(savedAvailability);
        console.log("🧠 Från AsyncStorage:", parsed);
        setAvailability(parsed);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("availability")
        .select("*")
        .eq("barber_id", barberId)
        .eq("date", formattedDate);

      if (error) {
        console.error("Fel vid hämtning av availability:", error);
      } else {
        const availabilityData = data.reduce((acc, curr) => {
          acc[curr.time_slot] = curr.available;
          return acc;
        }, {});
        console.log("🧠 Från Supabase:", availabilityData);
        setAvailability(availabilityData);
        await AsyncStorage.setItem(`availability-${formattedDate}`, JSON.stringify(availabilityData));
      }

      setLoading(false);
    };

    fetchAvailability();
  }, [selectedDate, barberId]);

  const handleToggle = async (timeSlot) => {
    const isCurrentlyAvailable = availability[timeSlot] ?? false;
    const newAvailable = !isCurrentlyAvailable;

    const updatedAvailability = { ...availability, [timeSlot]: newAvailable };
    setAvailability(updatedAvailability);

    const { error } = await supabase
      .from("availability")
      .upsert(
        [
          {
            barber_id: barberId,
            date: format(selectedDate, "yyyy-MM-dd"),
            time_slot: timeSlot,
            available: newAvailable,
          },
        ],
        { onConflict: ['barber_id', 'date', 'time_slot'] }
      );

    if (error) {
      console.error("Fel vid upsert:", error);
    }

    await AsyncStorage.setItem(`availability-${format(selectedDate, "yyyy-MM-dd")}`, JSON.stringify(updatedAvailability));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <CalendarHeader selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      {loading ? (
        <ActivityIndicator color="white" style={{ marginTop: 20 }} />
      ) : barberId ? (
        <DayAvailability
          selectedDate={selectedDate}
          availability={availability}
          onToggle={handleToggle}
        />
      ) : (
        <Text style={{ color: "white", marginTop: 20 }}>Laddar användaruppgifter...</Text>
      )}
    </View>
  );
}