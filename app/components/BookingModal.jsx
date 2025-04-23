import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
  Switch,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";

export default function BookingModal({ date, onClose, barberId, onBookingAdded }) {
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [time, setTime] = useState("12:00");
  const [showTimes, setShowTimes] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showServices, setShowServices] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);

  const times = Array.from({ length: 20 }, (_, i) => {
    const hour = 12 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour}:${minute}`;
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: customerData } = await supabase.from("Customers").select("*");
      setCustomers(customerData || []);

      const { data: serviceData } = await supabase.from("Services").select("*");
      setServices(serviceData || []);
    };
    fetchData();
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = customers.filter((c) =>
      c.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setSearch(customer.name);
    setFilteredCustomers([]);
  };

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
    if (error) {
      console.error("Fel vid bokning:", error);
    } else {
      onBookingAdded();
      onClose();
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Skapa ny bokning</Text>

        {/* Tid */}
        <Pressable onPress={() => setShowTimes(!showTimes)} style={styles.input}>
          <Text style={styles.text}>{time}</Text>
        </Pressable>
        {showTimes && (
          <FlatList
            data={times}
            keyExtractor={(item) => item}
            style={{ maxHeight: 150 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setTime(item);
                  setShowTimes(false);
                }}
                style={{ padding: 8 }}
              >
                <Text style={styles.text}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Tjänst */}
        <Pressable onPress={() => setShowServices(!showServices)} style={styles.input}>
          <Text style={styles.text}>
            {selectedService ? selectedService.name : "Välj tjänst"}
          </Text>
        </Pressable>
        {showServices && (
          <FlatList
            data={services}
            keyExtractor={(item) => item.id}
            style={{ maxHeight: 120 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedService(item);
                  setShowServices(false);
                }}
                style={{ paddingVertical: 6 }}
              >
                <Text style={styles.text}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Kundsökning */}
        <TextInput
          value={search}
          onChangeText={handleSearch}
          placeholder="Sök kund..."
          placeholderTextColor="#aaa"
          style={styles.input}
        />
        {filteredCustomers.length > 0 && (
          <FlatList
            data={filteredCustomers}
            keyExtractor={(item) => item.email}
            style={{ maxHeight: 100 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelectCustomer(item)}
                style={{ paddingVertical: 6 }}
              >
                <Text style={styles.text}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Kundinfo */}
        <TextInput
          value={selectedCustomer?.name || ""}
          placeholder="Namn"
          placeholderTextColor="#aaa"
          editable={false}
          style={styles.input}
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

        {/* Återkommande toggle */}
        <View style={styles.toggleRow}>
          <Switch value={recurring} onValueChange={setRecurring} />
          <Text style={styles.text}>Upprepa varje vecka (4 ggr)</Text>
        </View>

        {/* Boka-knapp */}
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