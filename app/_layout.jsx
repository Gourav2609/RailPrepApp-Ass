import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Login",
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: "Sign Up",
        }}
      />
      <Stack.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      {/* <Stack.Screen
        name="home/[id]"
        options={{
          title: "Sub Category",
        }}
      /> */}
    </Stack>
  );
};

export default RootLayout;
