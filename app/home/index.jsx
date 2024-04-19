import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator, TouchableOpacity , BackHandler , Alert } from "react-native";
import Cards from "../../components/Cards";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          setError("An error occurred while fetching data. Please logout and try again.");
          return;
        }
        const data = await response.json();
        console.log("Data:", data);
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while fetching data. Please logout and try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setCategories([]);
    setLoading(true);
    setError(null);
    fetchData();
  };

  useEffect(() => {
    console.log("Categories:", categories);
  }, [categories]);

  const backAction = () => {
    Alert.alert('Hold on!', 'Are you sure you exit RailPrep', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'YES', onPress: () => BackHandler.exitApp()},
    ]);
    return true;
  };

  const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    backAction,
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={styles.cardsContainer}>
            {categories.map((item) => (
              <Cards key={item.id} data={item} redirect={true}/>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  cardsContainer: {
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignContent:"center",
    alignItems:"center",
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});

export default Home;
