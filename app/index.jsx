import { 
  View, 
  Text, 
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import LogoHeader from "@/app/components/LogoHeader.jsx";
import InputField from "@/app/components/InputField.jsx";
import PrimaryButton from "@/app/components/PrimaryButton.jsx";
import { useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    // Du kan koppla till Supabase här
    console.log("Email:", email);
    console.log("Password:", password);

    // Navigera till appens insida om inloggning lyckas
    router.replace("/(tabs)"); 
  };

  const handleSignUp = () => {
    // Navigera till registreringssidan
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
        <InputField
          placeholder="E-post"
          value={email}
          onChangeText={setEmail}
        />
        <InputField
          placeholder="Lösenord"
          secure
          value={password}
          onChangeText={setPassword}
        />
        
        <Text
          onPress={handleSignUp}
          style={{
            color: "grey",
            marginTop: 10,
            fontSize: 16,
          }}
        >
          Ny användare? Skapa konto
        </Text>

        <PrimaryButton title="Logga in" onPress={handleLogin} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}