import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';

const SubCards = ({ data, redirect }) => {
  const windowWidth = Dimensions.get("window").width;
  const cardWidth = windowWidth * 0.9;
  const id = data._id;

  const handlePress = () => {
    if (redirect) {
      router.push(`/home/subcategory/${id}`);
      // router.replace("/home/testing");
    }
  };

  return (
    <View style={[styles.card, { width: cardWidth }]}>
      <Text style={styles.title}>{data.title}</Text>
      {redirect && (
        <TouchableOpacity style={styles.readMoreButton} onPress={handlePress}>
          <Text style={styles.readMoreButtonText}>Learn more</Text>
          <FontAwesome name="angle-right" size={20} color="#ffffff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    // backgroundColor: '#ecf2f9',
    backgroundColor:"#fff",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: "#d6d7da",
  },
  title: {
    fontSize: 22,
    fontWeight:'500',
    marginBottom: 8,
    //padding: 12,
    textAlign: "center",
    backgroundColor:"#ecf2f9",
    borderRadius: 8,
    paddingVertical:16,
    paddingHorizontal:2,
    borderWidth: 0.5,
    borderColor: "#d6d7da",
  },
  content: {
    fontSize: 16,
    marginBottom: 8,
  },
  readMoreButton: {
    backgroundColor: '#007BFF',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignItems: 'center',
    // width:100,
    display:"flex",
    flexDirection:"row",
    justifyContent:"center",
    gap:8,
  },
  readMoreButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '400',
  },
});

export default SubCards;
