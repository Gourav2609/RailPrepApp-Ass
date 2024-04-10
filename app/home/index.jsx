import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import Cards from "../../components/Cards";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("Token:", token);
        if (token) {
          const response = await fetch("https://railprep.devshots.io/api/v1/category/all", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            console.log("HTTP error:", response);
            return;
          }
          const data = await response.json();
          console.log("Data:", data);
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Categories:", categories);
  }, [categories]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.cardsContainer}>
          {categories.map((item) => (
            <Cards key={item.id} data={item} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb", // adjust background color as needed
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export default Home;
