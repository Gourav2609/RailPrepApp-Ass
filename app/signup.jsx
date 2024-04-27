import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  ActivityIndicator,
  Dimensions,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import { router ,Link } from "expo-router";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const windowWidth = Dimensions.get('window').width;
  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  const handleSignUp = () => {
    setLoading(true);
    fetch("https://railprep.devshots.io/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        username: username,
      }),
    })
      .then((response) => {
        setLoading(false);
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          showToast("Registration successful");
          AsyncStorage.setItem("token", data.token)
            .then(() => {
              setEmail("");
              setPassword("");
              setUsername("");
              setName("");
              router.push("/home");
            })
            .catch((error) => {
              showToast("Error saving token");
              console.error("Error saving token:", error);
            });
        } else {
          showToast("Registration failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Let's Get You Started</Text>
      <View style={styles.inputContainer}>
        <FontAwesome
          name="user-circle"
          size={24}
          color="#183153"
          style={styles.icon}
        />
        <TextInput
          style={[styles.input, { width: windowWidth*0.68 }]}
          placeholder="Full Name"
          value={name}
          onChangeText={(text) => setName(text)}
          autoCapitalize="words"
        />
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome
          name="user"
          size={24}
          color="#183153"
          style={styles.icon}
        />
        <TextInput
          style={[styles.input, { width: windowWidth*0.7 }]}
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome
          name="envelope"
          size={24}
          color="#183153"
          style={styles.icon}
        />
        <TextInput
          style={[styles.input, { width: windowWidth*0.68 }]}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome
          name="lock"
          size={24}
          color="#183153"
          style={styles.icon}
        />
        <TextInput
          style={[styles.input, { width: windowWidth*0.7 }]}
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity><Text>
        Already have an account?
      </Text>
      <Link href="/signin" style={styles.signUpLink}>
        Log In
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
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
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
  },
  input: {
    height: 50,
    // borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
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
  activityIndicatorContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    height: "100%",
  },
  signUpLink: {
    fontSize: 20,
    color: "#007BFF",
    textDecorationLine: "underline",
  }
});

export default SignUpPage;
