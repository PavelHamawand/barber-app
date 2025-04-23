import { useState } from "react";
import { FlatList, TextInput, Text, TouchableOpacity } from "react-native";

export default function CustomerSelector({ customers, selectedCustomer, onSelect }) {
  const [search, setSearch] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = customers.filter((c) =>
      c.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  return (
    <>
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
              onPress={() => {
                onSelect(item);
                setSearch(item.name);
                setFilteredCustomers([]);
              }}
              style={{ paddingVertical: 6 }}
            >
              <Text style={styles.text}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </>
  );
}

const styles = {
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
};