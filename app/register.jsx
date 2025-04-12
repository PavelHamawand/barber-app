import { View, Text, Alert, TouchableOpacity } from "react-native";
import InputField from "@/app/components/InputField.jsx";
import PrimaryButton from "@/app/components/PrimaryButton.jsx";
import { supabase } from "@/lib/supabase.js";
import { useState } from "react";
import { router } from "expo-router";
import { Button } from "react-native-web";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) {
      Alert.alert("Fel vid registrering", error.message);
    } else {
      Alert.alert("Checka din mejl!", "Verifieringslänk har skickats.");
      router.push('/');
    }

    setLoading(false);
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" }}>
      <Text style={{ fontSize: 24, color: 'white', marginBottom: 20 }}>Skapa nytt konto</Text>

      <InputField 
        placeholder="Namn"
        value={name}
        onChangeText={setName}
      />
      <InputField 
        placeholder="E-post"
        value={email}
        onChangeText={setEmail}
      />
      <InputField 
       
        placeholder="Lösenord"
        value={password}
        onChangeText={setPassword}
        secure
      />
      
      <Text onPress={() => router.push("/")}>
        <Text style={{ color: "grey", marginTop: 10, fontSize: 16 }}>
          Redan användare? Logga in
        </Text>
      </Text>

      <PrimaryButton 
        title={loading ? "Registrerar..." : "Registrera"}
        onPress={handleRegister}
        disabled={loading}
      />
    </View>
  );
}