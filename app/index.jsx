import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  SafeAreaView,
  Button,
} from "react-native";
import React, { useEffect, useRef , useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const LandingPage = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [animation , setAnimation] = useState(false);

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(()=>{
      setAnimation(true);
    });
  };

  useEffect(() => {
    fadeIn();
  }, []);

  useEffect(() => {
    if(animation){
      checkifLoggedIn();
    }
  }, [animation]);

  const checkifLoggedIn = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      router.push("/home");
    } else {
      router.push("/signin");
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.fadingContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={styles.fadingText}>Welcome to RailPrep :{")"}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  fadingContainer: {
    padding: 20,
  },
  fadingText: {
    fontSize: 28,
  },
  buttonRow: {
    flexBasis: 100,
    justifyContent: "space-evenly",
    marginVertical: 16,
  },
});

export default LandingPage;
