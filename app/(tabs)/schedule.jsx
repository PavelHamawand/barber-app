import { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import CalendarHeader from "@/app/components/CalendarHeader.jsx"; // Komponent för att visa månad och veckodagar
import DaySchedule from "@/app/components/DaySchedule.jsx";     // Komponent som visar schemat för en dag
import { supabase } from "@/lib/supabase.js";                   // Supabase-instans för API-förfrågningar
import { format } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage"; // För att hämta sparad användardata lokalt

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState(new Date()); // Aktuellt valt datum
  const [bookings, setBookings] = useState([]);                 // Lista över bokningar för valt datum
  const [loading, setLoading] = useState(true);                 // Visar laddningsstatus
  const [barberId, setBarberId] = useState(null);               // ID för den inloggade frisören

  // Hämtar barberId från AsyncStorage när komponenten laddas första gången
  useEffect(() => {
    const fetchBarberId = async () => {
      try {
        const barber = await AsyncStorage.getItem("barber"); // Hämta sparad användardata
        if (barber) {
          const barberData = JSON.parse(barber);             // Omvandla från sträng till objekt
          setBarberId(barberData.id);                        // Sätt barberId från datan
        }
      } catch (error) {
        console.error("Fel vid hämtning av barber-id från AsyncStorage:", error);
      }
    };

    fetchBarberId();
  }, []);

  // Hämtar bokningar för valt datum och inloggad frisör
  useEffect(() => {
    if (!barberId) return;
  
    const fetchBookings = async () => {
      setLoading(true);
  
      // Formatera datumet som YYYY-MM-DD (det som Supabase Date-kolumn förväntar sig)
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
  
      const { data, error } = await supabase
  .from("Bookings")
  .select(`
    customer_name,
    time_slot,
    service:service_id ( name )
  `)
  .eq("barber_id", barberId)
  .eq("date", formattedDate);
  
      if (error) {
        console.error("Error fetching bookings:", error);
      } else {
        setBookings(data);
        console.log("barberId:", barberId);
        console.log("selectedDate:", selectedDate);
        console.log("formattedDate:", formattedDate);
        console.log("Fetched data:", data);
      }
  
      setLoading(false);
    };
  
    fetchBookings();
  }, [selectedDate, barberId]); // Kör om datumet eller barberId ändras

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      {/* Kalenderhuvud med månad och veckodagar */}
      <CalendarHeader selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      
      {/* Visa laddningsindikator om laddning pågår */}
      {loading ? (
        <ActivityIndicator color="white" style={{ marginTop: 20 }} />
      ) : barberId ? (
        // Visa schemat för dagen om vi har ett barberId
        <DaySchedule bookings={bookings} />
      ) : (
        // Visa ett meddelande om användarinfo inte finns ännu
        <Text style={{ color: "white", marginTop: 20 }}>Laddar användaruppgifter...</Text>
      )}
    </View>
  );
} 