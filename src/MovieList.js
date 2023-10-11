import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native'; // Import FlatList component
import Swiper from 'react-native-swiper';
import axios from 'axios';
import FooterNavigation from './FooterNavigation';
import { useNavigation } from '@react-navigation/native';


const MovieList = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [limitedMovies, setAllMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [genreMapping, setGenreMapping] = useState({});




  const apiKey = '5687eb97cfae2d5641269e1c0c74eefc';
  const navigation = useNavigation();

  useEffect(() => {
    getPopularMovies();
    getLatestMovies();
    getAllMovies();
    getGenre();
  }, []);

  const getPopularMovies = () => {
    axios
      .get(`https://api.themoviedb.org/3/discover/movie`, {
        params: {
          api_key: apiKey,
          language: 'en-US',
          sort_by: 'popularity.desc',
          page: 1,
        },
      })
      .then((response) => {
        setPopularMovies(response.data.results);

      })
      .catch((error) => {
        console.error('Error fetching popular movies:', error);
      });
  };



  const getLatestMovies = () => {

    axios
      .get(`https://api.themoviedb.org/3/discover/movie`, {
        params: {
          api_key: apiKey,
          language: 'en-US',
          sort_by: 'release_date.desc',
          page: 1,
        },
      })
      .then((response) => {
        setLatestMovies(response.data.results);
      })
      .catch((error) => {
        console.error('Error fetching latest movies:', error);
      });
  };
  const getAllMovies = async () => {
    const totalPages = 10;
    let allMovies = [];

    for (let page = 1; page <= totalPages; page++) {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
          params: {
            api_key: apiKey,
            language: 'en-US',
            page: page,
            include_adult: false,
          },
        });

        const limitedMovies = response.data.results;
        allMovies = [...allMovies, ...limitedMovies];
      } catch (error) {
        console.error('Error fetching movies for page', page, ':', error);
      }
    }

    setAllMovies(allMovies);
  };

  const getGenre = () => {
    axios
      .get(`https://api.themoviedb.org/3/genre/movie/list`, {
        params: {
          api_key: apiKey,
          language: 'en-US',
          page: 1,
          include_adult: false,
        },
      })
      .then((response) => {
        const genres = response.data.genres;
        setCategories(genres.map((genre) => genre.name));
        const newGenreMapping = {};
        genres.forEach((genre) => {
          newGenreMapping[genre.name] = genre.id;
        });

        setGenreMapping(newGenreMapping);
      })
      .catch((error) => {
        console.error('Error fetching genres:', error);
      });
  };


  const handleCategoryClick = (category) => {
    setSelectedCategory(category);

    navigation.navigate('Category', { category, limitedMovies, genreMapping });
  };
  const handleSingleVideoPage = (id) => {
    console.log(id);
    navigation.navigate('VideoCard', { id });
  }
  return (
    <View>


      <ScrollView >
        <View>


          {/* dots working */}
          <View>
            <Swiper style={{ height: 400 }} showsPagination={true} dotStyle={{ backgroundColor: 'gray', width: 10, height: 10 }} activeDotStyle={{ backgroundColor: '#ff4d4d', width: 20, height: 10 }}>
              {popularMovies.slice(0, 5).map((movie) => (
                <View key={movie.id} style={{ flex: 1 }}>
                  <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w500/${movie.poster_path}` }}
                    style={{ flex: 1 }}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </Swiper>
            </View>
          




          <Text style={styles.categoryText}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 30 }}>
            <FlatList
              data={categories}
              horizontal
              renderItem={({ item }) => (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <TouchableOpacity
                    style={
                      selectedCategory === item
                        ? [styles.categoryButton, styles.selectedCategoryButton]
                        : styles.categoryButton

                    }
                    onPress={() => handleCategoryClick(item)}
                  >
                    <Text
                      style={
                        selectedCategory === item
                          ? [styles.buttonText, styles.selectedButtonText]
                          : styles.buttonText
                      }
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                </View>

              )}
              keyExtractor={(item) => item}
            />
          </ScrollView>



          <View>
            <Text style={{ marginTop: 30, marginLeft: 5, fontWeight: 'bold',  fontSize:16 }}>Most Popular</Text>
            <FlatList style={styles.PopularList}
              data={popularMovies}
              horizontal
              renderItem={({ item }) => (

                <View key={item.id}>
                  <TouchableOpacity onPress={() => handleSingleVideoPage(item.id)}>

                    <Image
                      source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }}
                      style={{ width: 100, height: 150, marginRight: 10, borderRadius: 10 }}
                      resizeMode="cover"
                    />

                  </TouchableOpacity>
                </View>

              )}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>

          <View>
            <Text style={{ marginTop: 30, marginLeft: 5, fontWeight: 'bold' , fontSize:16}}>Latest Movies</Text>
            <FlatList style={styles.LatestList}
              data={latestMovies.filter((movie) => movie.poster_path)}
              horizontal
              renderItem={({ item }) => (
                <View key={item.id}>
                  <TouchableOpacity onPress={() => handleSingleVideoPage(item.id)}>
                    <Image
                      source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }}
                      style={{ width: 100, height: 150, marginRight: 10, borderRadius: 10 }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
            />

          </View>





          <View style={{ marginTop: 100 }}>

          </View>
        </View>


      </ScrollView>
      <FooterNavigation marginTop={-80} height={80} />
    </View>

  );
};

const styles = StyleSheet.create({
  categoryButton: {
    padding: 8,
    backgroundColor: '#004080',
    borderRadius: 15,
    width: 95,
    marginLeft: 10,
    height: 33
  },
  buttonText: {
    color: 'white',
    alignContent: 'center',
    marginLeft: 5
  },
  PopularList: {
    marginTop: 10,
    marginLeft: 5
  },
  LatestList: {
    marginTop: 10,
    marginLeft: 5,
    

  },
  selectedCategoryButton: {
    backgroundColor: '#ff4d4d',
  },
  categoryText: {
    marginTop: 10,
    marginLeft: 7,
    marginBottom: -15,
    fontWeight: 'bold',
    fontSize:16
  }
});

export default MovieList;
