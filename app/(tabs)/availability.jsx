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

  // Hämtar barberId från AsyncStorage
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

  // Hämtar tillgänglighet för vald dag och frisör
  useEffect(() => {
    if (!barberId) return;

    const fetchAvailability = async () => {
      setLoading(true);
      const formattedDate = format(selectedDate, "yyyy-MM-dd");

      const { data, error } = await supabase
        .from("availability")
        .select("*")
        .eq("barber_id", barberId)
        .eq("date", formattedDate);

      if (error) {
        console.error("Fel vid hämtning av availability:", error);
      } else {
        const availabilityData = data.reduce((acc, curr) => {
          acc[curr.timeslot] = curr.available;
          return acc;
        }, {});
        setAvailability(availabilityData);
      }

      setLoading(false);
    };

    fetchAvailability();
  }, [selectedDate, barberId]);

  // Toggle availability (blockera eller gör en tid tillgänglig)
  const handleToggle = async (timeSlot) => {
    const isCurrentlyAvailable = availability[timeSlot] ?? false;
    const newAvailable = !isCurrentlyAvailable;
  
    // Uppdatera state direkt för bättre respons i UI
    setAvailability((prev) => ({
      ...prev,
      [timeSlot]: newAvailable,
    }));
  
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
        { onConflict: ['barber_id', 'date', 'time_slot'] } // viktigt!
      );
  
    if (error) {
      console.error("Fel vid upsert:", error);
    }
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