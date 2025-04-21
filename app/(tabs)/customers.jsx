import { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet } from "react-native";
import { supabase } from "@/lib/supabase";
import CustomerItem from "@/app/components/CustomerItem";
import CustomerModal from "@/app/components/CustomerModal";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data, error } = await supabase
        .from("Customers")
        .select("*");

      if (error) {
        console.error("Fel vid hämtning av kunder:", error);
      } else {
        const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
        setCustomers(sorted);
        setFilteredCustomers(sorted);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const filtered = customers.filter((customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [search, customers]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Sök kund..."
        placeholderTextColor="#888"
        onChangeText={setSearch}
        value={search}
      />
      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CustomerItem customer={item} onPress={() => setSelectedCustomer(item)} />
        )}
      />
      <CustomerModal
        customer={selectedCustomer}
        visible={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  searchInput: {
    backgroundColor: "#1e1e1e",
    color: "white",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
});