import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Pdf from "react-native-pdf";
import SubCards from "../../../components/SubCategory";

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
  const [pdfTitle, setPdfTitle] = useState("");
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
    setPdfTitle(title);
  };

  // const PdfResource = {
  //   url: "https://icseindia.org/document/sample.pdf",
  //   cache: true,
  // };

  return (
    <>
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
              <Text>No Data Available</Text>
            ) : (
              subcategory.map((item) => (
                <SubCards key={item.id} data={item} redirect={true} />
              ))
            )}
          </View>

          <View style={styles.documentContainer}>
            <Text style={styles.documentTitle}>Documents</Text>
            {document.length === 0 ? (
              <Text>No Data Avaiable</Text>
            ) : (
              document.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.documentButton}
                  onPress={() => handleDocumentDownload(item.s3Url, item.title)}
                >
                  <View style={styles.titleContent}>
                    <FontAwesome
                      name="file-pdf-o"
                      size={20}
                      color="red"
                      style={styles.downloadIcon}
                    />
                    <Text style={styles.documentButtonText}>{item.title}</Text>
                  </View>
                  <FontAwesome
                    name="download"
                    size={20}
                    color="#717171"
                    style={styles.downloadIcon}
                  />
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </ScrollView>
    {pdfSource && (
        <View style={styles.pdfContainer}>
          <View style={styles.pdfHeader}>
            <Text style={styles.pdfTitle}>{pdfTitle}.pdf</Text>
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.pdfView}>
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
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    // minHeight: windowHeight,
    // marginTop: 30,
  },
  scrollViewContent: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    display: "flex",
    // justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "black",
    // minHeight: windowHeight,
    // height:"100%",
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
    width: "90%",
    marginTop: 20,
    display: "flex",
    alignContent: "flex-start",
    // backgroundColor:"black",
    // flexDirection: "row",
  },
  documentTitle: {
    fontSize: 24,
    fontWeight: "500",
    marginBottom: 10,
  },
  documentButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    gap: 10,
  },
  documentButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "400",
    marginRight: 10,
  },
  downloadIcon: {},
  titleContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  pdfContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  pdfHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  pdfTitle: {
    fontSize: 20,
    fontWeight: "400",
  },
  closeButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
  },
  pdfView: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  pdf: {
    flex: 1,
    width: "100%",
  },
});

export default Subcategory;
