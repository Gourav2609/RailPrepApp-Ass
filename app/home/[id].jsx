import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from 'expo-router';

const Subcategory = () => {
  const { id } = useLocalSearchParams();
  const [subcategory, setSubcategory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("Token:", token);
      if (token) {
        const response = await fetch(`https://railprep.devshots.io/api/v1/category/${id}`, {
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
        setSubcategory(data.data.categories);
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
    setSubcategory([]);
    setLoading(true); 
    fetchData();
  }, [id]);

  const onRefresh = () => {
    setRefreshing(true);
    setSubcategory([]);
    setLoading(true); 
    fetchData();
  };

  useEffect(() => {
    console.log("Subcategory:", subcategory);
  }, [subcategory]);

  return (
    <View style={styles.container}>
      {loading ? ( 
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text>{error}</Text>
        </View>
      ): (
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={styles.table}>
            <View style={styles.tableRowHeader}>
              <Text style={styles.headerCell}>Title</Text>
              <Text style={styles.headerCell}>Created At</Text>
              <Text style={styles.headerCell}></Text>
            </View>
            {subcategory.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={styles.cell}>{item.title}</Text>
                <Text style={styles.cell}>{item.createdAt}</Text>
                <TouchableOpacity style={styles.button} disabled>
                  <Text style={styles.buttonText}>Read more</Text>
                </TouchableOpacity>
              </View>
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
  table: {
    // flex: 1,
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tableRowHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  headerCell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  cell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    textAlign: "center",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "#b0cfff",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Subcategory;
