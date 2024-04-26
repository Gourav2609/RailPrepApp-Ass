import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';

const SubCards = ({ data, redirect }) => {
  const windowWidth = Dimensions.get('window').width;
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
          <Text style={styles.readMoreButtonText}>Learn More</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    marginBottom: 8,
  },
  readMoreButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  readMoreButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SubCards;
