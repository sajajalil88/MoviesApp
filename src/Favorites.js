import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon2 from 'react-native-vector-icons/Ionicons'; 
import FooterNavigation from './FooterNavigation';

const Favorites = ({ route }) => {
  const [favoritesArray, setFavoritesArray] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const getFavorites = async () => {
      try {
        const favorites = await AsyncStorage.getItem('favorites');
        if (favorites !== null) {
          const favoritesArray = JSON.parse(favorites);
          setFavoritesArray(favoritesArray);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    getFavorites();
    // clearLocalStorage();
  }, []);

  const clearLocalStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('Local storage cleared successfully.');
    } catch (error) {
      console.error('Error clearing local storage:', error);
    }
  };
  const removeFromFavorites = async (movieId) => {
    try {
      const updatedFavoritesArray = favoritesArray.filter((item) => item.id !== movieId);
      setFavoritesArray(updatedFavoritesArray);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavoritesArray));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  
  const handleSingleVideoPage = (id) => {
    console.log(id);
    navigation.navigate('VideoCard', { id });
  }
  return (

 
    <ScrollView>

<View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon2 name="arrow-back-outline" size={35} color="black"  style={styles.backButton}/> 
        </TouchableOpacity>
        <Text style={styles.header}>Saved</Text>
      </View>
      {favoritesArray.map((item) => (

        <View key={item.id} style={styles.movieContainer}>

<TouchableOpacity onPress={() => handleSingleVideoPage(item.id)}>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }}
            style={styles.poster}
          />
          </TouchableOpacity>
          <View style={styles.movieInfo}>
            <Text style={styles.title}>{item.original_title}</Text>
            <Text style={styles.genre}>
              {item.genres?.map((genre) => genre.name).join(', ')}
            </Text>
            <Text style={styles.rating}>{item.vote_average}/10</Text>
          </View>
          <TouchableOpacity onPress={() => removeFromFavorites(item.id)}>
            <Text style={styles.clearButton}>X</Text>
          </TouchableOpacity>
        </View>
      ))}

      
    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    marginTop: 70,
    alignContent:'center',
    marginLeft:'31%'
  },
  headerContainer:{
    flexDirection: 'row',
    display:'flex'
  },
  backButton:{
    marginTop: 70,
    marginLeft:17
    
  },
  movieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor:'#ededed',
    borderRadius:20,
    marginTop:15
  },
  poster: {
    width: 110,
    height: 120,
    resizeMode: 'cover',
    marginRight: 10,
    borderRadius:20
  
  },
  movieInfo: {
    flex: 1,
  },
  title: {
    fontSize: 15 ,
   marginBottom:10,
   fontWeight:'bold'
  },
  genre: {
    fontSize: 13,
    color: '#666',
    marginBottom:25,
  },
  rating: {
    fontSize: 10,
    marginTop: 20,
  },
  clearButton: {
    color: 'grey',
    fontWeight: 'bold',
    marginLeft: 4,
    marginBottom:80,
   
  },
});

export default Favorites;
