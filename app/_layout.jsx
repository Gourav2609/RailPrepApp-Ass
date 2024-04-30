import { Stack } from "expo-router";
// import 'expo-dev-client';

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Login",
          headerShown: false,
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
          title: "RailPrep",
          headerShown: false,
        }}
      />
      <Stack.Screen
       name="signin"
        options={{
          title: "Login In",
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
