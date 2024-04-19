import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  ActivityIndicator,
  Image,
} from "react-native";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  useEffect(() => {
    checkifLoggedIn();
  }, []);

  const checkifLoggedIn = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      router.push("/home");
    }
  };

  const handleLogin = () => {
    setLoading(true);
    fetch("https://railprep.devshots.io/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => {
        setLoading(false);
        if (!response.ok) {
          console.log("HTTP error:", response);
          showToast("Login failed");
          throw new Error("Login failed");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Login response:", data);
        if (data.success && data.token) {
          console.log("Login successful");
          showToast("Login successful");
          AsyncStorage.setItem("token", data.token)
            .then(() => {
              console.log("Token saved in local storage", data.token);
            })
            .catch((error) => {
              console.error("Error saving token:", error);
            });
          router.push("/home");
        } else {
          console.log("Login failed", data);
          showToast("Login failed");
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.welcomeText}>Welcome to RailPrep</Text> */}
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
      />
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#777" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#777" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
        <Icon name="sign-in" size={20} color="white" />
      </TouchableOpacity>
      <Text>
        Don't have an account?
      </Text>
      <Link href="/signup" style={styles.signUpLink}>
        Sign Up
      </Link>
      {loading && (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    // borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 10,
    color: "#183153",
  },
  input: {
    flex: 1,
    height: 50,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpLink: {
    fontSize: 20,
    color: "#007BFF",
    textDecorationLine: "underline",
  },
  activityIndicatorContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0)",
    width: "100%",
    height: "100%",
  },
});

export default LoginPage;
