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
  Dimensions,
  Modal,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import Pdf from "react-native-pdf";
import SubCards from "../../../components/SubCategory";

let windowHeight = Dimensions.get("window").height;

const Subcategory = () => {
  const { id } = useLocalSearchParams();
  const [subcategory, setSubcategory] = useState([]);
  const [document, setDocument] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [parentCategory, setParentCategory] = useState("");
  const [error, setError] = useState(null);
  const [pdfSource, setPdfSource] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const toggleModal = () => {
    setModalVisible(!modalVisible);
    setPdfSource(null);
  };

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
        router.setParams({ name: data.data.parent.title });
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
    setPdfSource(null);
    setLoading(true);
    fetchData();
  }, [id]);

  const onRefresh = () => {
    setRefreshing(true);
    setSubcategory([]);
    setLoading(true);
    setPdfSource(null);
    fetchData();
  };

  useEffect(() => {
    console.log("Subcategory:", subcategory);
  }, [subcategory, parentCategory]);

  useEffect(() => {
    console.log("PDF Source:", pdfSource);
  }, [pdfSource]);

  const handleDocumentDownload = async (url, title) => {
    setPdfSource({ uri: url, cache: true });
  };

  // const PdfResource = {
  //   url: "https://icseindia.org/document/sample.pdf",
  //   cache: true,
  // };

  return (
    <ScrollView style={styles.container}>
      {/* <View style={styles.parentCategoryContainer}>
        <Text style={styles.parentCategoryText}>{parentCategory}</Text>
      </View> */}
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
            {subcategory.length === 0 ? (
              <Text>No subcategories available</Text>
            ) : (
              subcategory.map((item) => (
                <SubCards key={item.id} data={item} redirect={true} />
              ))
            )}
          </View>

          <View style={styles.documentContainer}>
            <Text style={styles.documentTitle}>Documents</Text>
            {document.length === 0 ? (
              <Text>No documents available</Text>
            ) : (
              document.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.documentButton}
                  onPress={() => handleDocumentDownload(item.s3Url, item.title)}
                >
                  <Text style={styles.documentButtonText}>{item.title}</Text>
                  <Icon
                    name="file-pdf-o"
                    size={20}
                    color="#fff"
                    style={styles.downloadIcon}
                  />
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      )}
      {pdfSource && (
        <View style={styles.pdfContainer}>
          {/* <View style={styles.closeButtonContainer}> */}
          <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close PDF</Text>
          </TouchableOpacity>
          {/* </View> */}
          <Pdf
            trustAllCerts={false}
            source={pdfSource}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`number of pages: ${numberOfPages}`);
            }}
            style={styles.pdf}
            onError={(error) => {
              console.log(error);
            }}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    minHeight: windowHeight,
    // backgroundColor: "red",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
    // backgroundColor:"red",
    minHeight: windowHeight,
    height: "100%",
  },
  parentCategoryContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    // position: "fixed"
  },
  parentCategoryText: {
    fontSize: 20,
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
  pdfContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: windowHeight,
    height: "100%",
    backgroundColor: "f9fafb",
    backfaceVisibility: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonContainer: {
    width: "100%",
    // backgroundColor:"black",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 100,
    padding: 10,
    borderRadius: 5,
    width:Dimensions.get("window").width/5,
    backgroundColor: "red",
    // alignSelf: "flex-end",
    // marginHorizontal: 10,
    // marginTop: 10,
  },
  closeButtonText: {
    color: "white",
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    minHeight: Dimensions.get("window").height,
    // marginTop: 20,
  },
});

export default Subcategory;
