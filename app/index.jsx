import { 
  View, 
  Text, 
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard, 
} from "react-native";
import LogoHeader from "/Users/pavelhamawand/barber-app/app/components/LogoHeader.jsx";
import InputField from "/Users/pavelhamawand/barber-app/app/components/InputField.jsx";
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
          <PrimaryButton title="Logga in" onPress={handleLogin} />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    
  );
}