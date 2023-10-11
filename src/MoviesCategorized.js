import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import FooterNavigation from './FooterNavigation';

const MoviesCategorized = () => {
  const route = useRoute();
  const { category, limitedMovies, genreMapping } = route.params;
  const [filteredMovies, setFilteredMovies] = useState([]);
   const navigation = useNavigation();

  

   const filterMoviesByCategory = () => {
   
    const genreId = genreMapping[category];
    const filtered = limitedMovies.filter((movie) => {
      return movie.genre_ids.includes(genreId);
    });
    setFilteredMovies(filtered);
  };

  useEffect(() => {
    filterMoviesByCategory();
    console.log(limitedMovies.splice(0,1))
  }, [category, limitedMovies]);

  const numColumns = 3;

  const groupMoviesIntoRows = (movies, numColumns) => {
    const result = [];
    for (let i = 0; i < movies.length; i += numColumns) {
      result.push(movies.slice(i, i + numColumns));
    }
    return result;
  };
  const handleSingleVideoPage = (id) => {
    console.log(id);
    navigation.navigate('VideoCard', { id });
  }
  return (
    
   
    <View style={styles.container}>

<FlatList
  data={groupMoviesIntoRows(filteredMovies, numColumns)}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item: row }) => (
    <View style={styles.rowContainer}>
      {row.map((movie) => (
        <TouchableOpacity
          key={movie.id}
          onPress={() => handleSingleVideoPage(movie.id)} 
        >
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500/${movie.poster_path}` }}
            style={styles.moviePoster}
            resizeMode="cover"
          />
        </TouchableOpacity>
      ))}
    </View>
  )}
/>


    </View>
 
  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    marginLeft:10
  },
  moviePoster: {
    width: 100,
    height: 150,
    marginRight: 10,
    borderRadius: 10,
  },
});

export default MoviesCategorized;
