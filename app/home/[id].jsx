import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import Cards from "../../components/Cards";

const Subcategory = () => {
  const { id } = useLocalSearchParams();
  const [subcategory, setSubcategory] = useState([]);
  const [document, setDocument] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [parentCategory, setParentCategory] = useState("");
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("Token:", token);
      if (token) {
        const response = await fetch(
          `https://railprep.devshots.io/api/v1/category/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          console.log("HTTP error:", response);
          setError(
            "An error occurred while fetching data. Please logout and try again."
          );
          return;
        }
        const data = await response.json();
        console.log("Data:", data);
        console.log("Documents", data.data.documents);
        setDocument(data.data.documents);
        setSubcategory(data.data.categories);
        setParentCategory(data.data.parent.title);
      }
    } catch (error) {
      console.error("Error:", error);
      setError(
        "An error occurred while fetching data. Please logout and try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setSubcategory([]);
    setParentCategory("");
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
  }, [subcategory, parentCategory]);

  const handleDocumentDownload = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "No supported app found to open the document.");
      }
    } catch (error) {
      console.error("Error opening URL:", error);
      Alert.alert("Error", "Failed to open the document.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.parentCategoryContainer}>
        <Text style={styles.parentCategoryText}>{parentCategory}</Text>
      </View>
      {loading ? (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text>{error}</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.table}>
            {subcategory.map((item) => (
              // <View key={item.id} style={styles.tableRow}>
              //   <Text style={styles.cell}>{item.title}</Text>
              //   {/* <Text style={styles.cell}>{item.createdAt}</Text> */}
              //   <TouchableOpacity style={styles.button} disabled>
              //     <Text style={styles.buttonText}>Learn more</Text>
              //   </TouchableOpacity>
              // </View>
              <Cards key={item.id} data={item} redirect={false} />
            ))}
          </View>

          <View style={styles.documentContainer}>
            <Text style={styles.documentTitle}>Documents</Text>
            <TouchableOpacity
              // key={item.id}
              style={styles.documentButton}
              onPress={() => handleDocumentDownload("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf")}
            >
              <Text style={styles.documentButtonText}>Dummy</Text>
              <Icon
                name="download"
                size={20}
                color="#fff"
                style={styles.downloadIcon}
              />
            </TouchableOpacity>
            {document.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.documentButton}
                onPress={() => handleDocumentDownload(item.url)}
              >
                <Text style={styles.documentButtonText}>{item.title}</Text>
                <Icon
                  name="download"
                  size={20}
                  color="#fff"
                  style={styles.downloadIcon}
                />
              </TouchableOpacity>
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
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  parentCategoryContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  parentCategoryText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  table: {
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignContent:"center",
    alignItems:"center",
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  documentContainer: {
    marginTop: 20,
  },
  documentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  documentButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007BFF",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  documentButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  downloadIcon: {
    marginLeft: "auto",
  },
});

export default Subcategory;
