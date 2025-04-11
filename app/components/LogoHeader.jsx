import { Image } from "react-native";

export default function LogoHeader() {
  return (
    <Image
      source={require('@/assets/images/logo.png')}
      style={{
        height: 200,
        width: 200,
        marginBottom: 100
      }}
      resizeMode="contain"
    />
  );
}