import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { Link, useNavigate, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
        // setLoading(false);
        console.log("Login response:", data);
        if (data.success && data.token) {
          console.log("Login successful");
          showToast("Login successful");
          // Save token in local storage
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
        // setLoading(false);
        console.log("Error:", error);
       
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: 300,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    width: 300,
    height: 50,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpLink: {
    marginTop: 10,
    fontSize: 16,
    color: "#007BFF",
    textDecorationLine: "underline",
  },
  activityIndicatorContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
    width: "100%",
    height: "100%",
  },
});

export default LoginPage;
