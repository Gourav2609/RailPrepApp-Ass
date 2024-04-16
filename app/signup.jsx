import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet , ToastAndroid  , ActivityIndicator} from 'react-native';
import { router} from 'expo-router'; 
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const showToast = (e) => {
    ToastAndroid.show(e, ToastAndroid.SHORT);
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
        console.log("Registration response:", response);
        return response.json();
      })
      .then((data) => {
        // setLoading(false);
        console.log("Registration response:", data);
        if (data.success) {
          console.log("Registration successful");
          showToast("Registration successful");
          AsyncStorage.setItem("token", data.token)
            .then(() => {
              console.log("Token saved in local storage", data.token);
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
          console.error("Registration failed:", data.error);
          showToast("Registration failed");
        
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={(text) => setName(text)}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
        autoCapitalize="none"
      />
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
      <TouchableOpacity
        style={styles.button}
        onPress={handleSignUp}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: 300,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    width: 300,
    height: 50,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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

export default SignUpPage;
