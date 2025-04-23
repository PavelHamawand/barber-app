import { FlatList, Pressable, Text, TouchableOpacity } from "react-native";

export default function TimeSelector({ time, setTime, show, toggle, bookedTimes }) {
  // Generera alla tider från 12:00 till 21:30
  const times = Array.from({ length: 20 }, (_, i) => {
    const hour = 12 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour}:${minute}`;
  });

  // Filtrera bort bokade tider
  const availableTimes = times.filter((timeSlot) => !bookedTimes.includes(timeSlot));


  return (
    <>
      <Pressable onPress={toggle} style={styles.input}>
  <Text style={styles.text}>{time || "Välj tid"}</Text>
</Pressable>
      {show && (
        <FlatList
          data={availableTimes}
          keyExtractor={(item) => item}
          style={{ maxHeight: 150 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setTime(item);
                toggle();
              }}
              style={{ padding: 8 }}
            >
              <Text style={styles.text}>{item}</Text>
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