import { FlatList, Pressable, Text, TouchableOpacity } from "react-native";

export default function ServiceSelector({ services, selectedService, show, toggle, onSelect }) {
  return (
    <>
      <Pressable onPress={toggle} style={styles.input}>
        <Text style={styles.text}>
          {selectedService ? selectedService.name : "Välj tjänst"}
        </Text>
      </Pressable>
      {show && (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          style={{ maxHeight: 120 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                onSelect(item);
                toggle();
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
