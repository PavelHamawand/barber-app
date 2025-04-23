import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Switch, TextInput } from "react-native";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import TimeSelector from "@/app/components/BookingModal/TimeSelector.jsx";
import ServiceSelector from "@/app/components/BookingModal/ServiceSelector.jsx";
import CustomerSelector from "@/app/components/BookingModal/CustomerSelector.jsx";

export default function BookingModal({ date, onClose, barberId, onBookingAdded }) {
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [time, setTime] = useState(null);
  const [showTimes, setShowTimes] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showServices, setShowServices] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [bookedTimes, setBookedTimes] = useState([]);

  // Hämta kunder och tjänster
  useEffect(() => {
    const fetchData = async () => {
      const { data: customerData } = await supabase.from("Customers").select("*");
      setCustomers(customerData || []);

      const { data: serviceData } = await supabase.from("Services").select("*");
      setServices(serviceData || []);
    };
    fetchData();
  }, []);

  // Hämta bokade tider för barberaren och datumet
  useEffect(() => {
    const formattedDate = new Date(date).toISOString().split("T")[0]; 
    const fetchBookedTimes = async () => {
      const { data: bookingsData } = await supabase
        .from("Bookings")
        .select("time_slot")
        .eq("barber_id", barberId)
        .eq("date", formattedDate);

      // Extrahera och skapa en lista med bokade tider
      const times = bookingsData ? bookingsData.map((booking) => booking.time_slot) : [];
      setBookedTimes(times);
    };

    if (barberId && date) {
      fetchBookedTimes();
    }
  }, [barberId, date]);

  const handleBooking = async () => {
    if (!selectedCustomer || !time || !selectedService) return;

    const baseDate = new Date(date);
    const bookings = [];

    for (let i = 0; i < (recurring ? 4 : 1); i++) {
      const bookingDate = new Date(baseDate);
      bookingDate.setDate(baseDate.getDate() + i * 7);
      bookings.push({
        barber_id: barberId,
        customer_name: selectedCustomer.name,
        customer_phone: selectedCustomer.number,
        customer_email: selectedCustomer.email,
        date: bookingDate.toISOString().split("T")[0],
        time_slot: time,
        service_id: selectedService.id,
      });
    }

    const { error } = await supabase.from("Bookings").insert(bookings);
    if (!error) {
      onBookingAdded();
      onClose();
    } else {
      console.error("Fel vid bokning:", error);
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Skapa ny bokning</Text>

        <TimeSelector
          time={time}
          setTime={setTime}
          show={showTimes}
          toggle={() => setShowTimes(!showTimes)}
          bookedTimes={bookedTimes}  // Skicka bokade tider här
        />

        <ServiceSelector
          services={services}
          selectedService={selectedService}
          show={showServices}
          toggle={() => setShowServices(!showServices)}
          onSelect={setSelectedService}
        />

        <CustomerSelector
          customers={customers}
          selectedCustomer={selectedCustomer}
          onSelect={setSelectedCustomer}
        />

        <TextInput
          value={selectedCustomer?.number || ""}
          placeholder="Telefon"
          placeholderTextColor="#aaa"
          editable={false}
          style={styles.input}
        />
        <TextInput
          value={selectedCustomer?.email || ""}
          placeholder="E-post"
          placeholderTextColor="#aaa"
          editable={false}
          style={[styles.input, { marginBottom: 10 }]}
        />

        <View style={styles.toggleRow}>
          <Switch value={recurring} onValueChange={setRecurring} />
          <Text style={styles.text}>Upprepa varje vecka (4 ggr)</Text>
        </View>

        <TouchableOpacity onPress={handleBooking} style={styles.button}>
          <Text style={styles.buttonText}>Boka</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 20,
  },
  closeBtn: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#444",
    backgroundColor: "#2a2a2a",
    padding: 10,
    borderRadius: 6,
    color: "#fff",
    marginBottom: 10,
  },
  text: {
    color: "#fff",
  },
  button: {
    backgroundColor: "#2f80ed",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
};