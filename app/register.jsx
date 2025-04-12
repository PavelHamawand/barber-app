import { View, Text, Alert } from "react-native";
import InputField from "@/app/components/InputField.jsx";
import PrimaryButton from "@/app/components/PrimaryButton.jsx";
import { supabase } from "@/lib/supabase.js";
import { useState } from "react";
import { router } from "expo-router";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert("Fel vid registrering", error.message);
    } else {
      // Skapa ny barber-profil i barbers-tabellen
      const userId = data.user?.id;

      if (userId) {
        const { error: insertError } = await supabase
          .from("Barbers")
          .insert([{ id: userId, name, email }]);

        if (insertError) {
          Alert.alert("Fel vid skapande av barber-profil", insertError.message);
        } else {
          Alert.alert("Verifiera din mejl", "En länk har skickats till din e-post.");
          router.push("/"); // Tillbaka till inloggning
        }
      }
    }

    setLoading(false);
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" }}>
      <Text style={{ fontSize: 24, color: 'white', marginBottom: 20 }}>Skapa nytt konto</Text>

      <InputField placeholder="Namn" value={name} onChangeText={setName} />
      <InputField placeholder="E-post" value={email} onChangeText={setEmail} />
      <InputField placeholder="Lösenord" value={password} onChangeText={setPassword} secure />

      <Text onPress={() => router.push("/")}>
        <Text style={{ color: "grey", marginTop: 10, fontSize: 16 }}>Redan användare? Logga in</Text>
      </Text>

      <PrimaryButton title={loading ? "Registrerar..." : "Registrera"} onPress={handleRegister} disabled={loading} />
    </View>
  );
}