import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import LogoHeader from "@/app/components/LogoHeader.jsx";
import InputField from "@/app/components/InputField.jsx";
import PrimaryButton from "@/app/components/PrimaryButton.jsx";
import { useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
  
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      Alert.alert("Fel vid inloggning", error.message);
    } else {
      const userId = data.user.id;
  
      const { data: barber, error: barberError } = await supabase
        .from("Barbers")
        .select("*")
        .eq("id", userId)
        .single();
  
      if (barberError) {
        Alert.alert("Fel", "Kunde inte hämta barber-profil.");
      } else {
        // Spara användarinformation lokalt
        await AsyncStorage.setItem("barber", JSON.stringify(barber));
  
        console.log("Inloggad som:", barber.name);
        router.replace("/(tabs)/home");
      }
    }
  
    setLoading(false);
  };

  const handleSignUp = () => {
    router.push("/register");
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <LogoHeader />
        <InputField placeholder="E-post" value={email} onChangeText={setEmail} />
        <InputField placeholder="Lösenord" secure value={password} onChangeText={setPassword} />

        <Text onPress={handleSignUp} style={{ color: "grey", marginTop: 10, fontSize: 16 }}>
          Ny användare? Skapa konto
        </Text>

        <PrimaryButton title={loading ? "Loggar in..." : "Logga in"} onPress={handleLogin} disabled={loading} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}