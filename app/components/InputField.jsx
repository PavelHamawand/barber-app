import { TextInput } from "react-native";
import { useState } from "react";

export default function InputField({ placeholder, secure = false, ...props }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      style={{
        width: 300,
        padding: 10,
        backgroundColor: 'darkgrey',
        borderRadius: 5,
        marginVertical: 8,
        color: 'black',
        borderWidth: 2,
        borderColor: isFocused ? '#fff' : 'transparent', // Vit kant vid fokus
        outlineStyle: 'none', // för webben
      }}
      placeholder={placeholder}
      placeholderTextColor={'grey'}
      secureTextEntry={secure}
      autoCapitalize="none"
      underlineColorAndroid="transparent" // ta bort Android highlight
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...props}
    />
  );
}