import { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, TouchableOpacity, Modal } from "react-native";
import CalendarHeader from "@/app/components/CalendarHeader.jsx";
import DaySchedule from "@/app/components/DaySchedule.jsx";
import { supabase } from "@/lib/supabase.js";
import { format } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons"; // För plusikonen
import BookingModal from "@/app/components/BookingModal.jsx"; // Skapa denna komponent

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [barberId, setBarberId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // Hanterar visning av bokningsmodal

  useEffect(() => {
    const fetchBarberId = async () => {
      try {
        const barber = await AsyncStorage.getItem("barber");
        if (barber) {
          const barberData = JSON.parse(barber);
          setBarberId(barberData.id);
        }
      } catch (error) {
        console.error("Fel vid hämtning av barber-id från AsyncStorage:", error);
      }
    };

    fetchBarberId();
  }, []);

  useEffect(() => {
    if (!barberId) return;

    const fetchBookings = async () => {
      setLoading(true);
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
      }

      setLoading(false);
    };

    fetchBookings();
  }, [selectedDate, barberId]);

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <CalendarHeader selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

      {loading ? (
        <ActivityIndicator color="white" style={{ marginTop: 20 }} />
      ) : barberId ? (
        <DaySchedule bookings={bookings} selectedDate={selectedDate} />
      ) : (
        <Text style={{ color: "white", marginTop: 20 }}>Laddar användaruppgifter...</Text>
      )}

      {/* Plus-knapp */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          position: "absolute",
          bottom: 30,
          right: 30,
          backgroundColor: "#2f80ed",
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* Modal för bokning */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <BookingModal
          date={selectedDate}
          onClose={() => setModalVisible(false)}
          barberId={barberId}
          onBookingAdded={() => {
            setModalVisible(false);
            // Hämta bokningar igen
            setTimeout(() => {
              setBookings([]);
            }, 300);
          }}
        />
      </Modal>
    </View>
  );
}