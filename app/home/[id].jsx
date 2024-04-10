import { View, Text  , StyleSheet} from "react-native";
import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';
import { useEffect , useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Cards from "../../components/Cards";


const Subcategory = () => {
  const { id } = useLocalSearchParams();
  useEffect(() => {
    console.log(id);
  }, [id]);
  const [subcategory , setSubcategory] = useState([]);

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
          setSubcategory(data.data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Subcategory:", subcategory);
  }, [subcategory]);

  return (
    <View>
      <View style={styles.cardsContainer}>
          {subcategory.map((item) => (
            <Cards key={item.id} data={item} />
          ))}
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
    cardsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
      },
});

export default Subcategory;
