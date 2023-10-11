import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  FlatList
} from "react-native";
import axios from "axios";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Ionicons'; 
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';



const YOUTUBE_BASE_URL = "https://www.youtube.com/watch";

const VideoCard = ({ route }) => {
  const { id } = route.params;
  const [movie, setMovie] = useState({});
  const [trailerUrl, setTrailerUrl] = useState("");
  const [more, setMore] = useState(false);
  const [text, setText] = useState([]);
  const[fullText, setFullText] = useState([]);
  const [favoritesArray, setFavoritesArray]  = useState([]);
  const navigation = useNavigation();
  const [similarMovies, setSimilarMovies] = useState([]);

  useEffect(() => {
    getMovieDetails(id);
    getVideo(id);
    getSimilarMovies(id)
  }, [id]);

  toggleShowText = (value) =>{
    return !value ;
  }
  const handleSingleVideoPage = (id) => {
    console.log(id);
    navigation.navigate('VideoCard', { id });
  }
  const getMovieDetails = (movieId) => {
    axios
      .get(`https://api.themoviedb.org/3/movie/${movieId}`, {
        params: {
          api_key: '5687eb97cfae2d5641269e1c0c74eefc',
          language: 'en-US',
        },
      })
      .then((response) => {
        setMovie(response.data);
        setText(response.data.overview.slice(0,100));
        setFullText(response.data.overview)
        console.log("\n" +response.data.overview.slice(0,100));
      })
      .catch((error) => {
        console.error('Error fetching movie details:', error);
      });
  };
  const getSimilarMovies = (movieId) => {
   
    axios
      .get(`https://api.themoviedb.org/3/movie/${movieId}`, {
        params: {
          api_key: '5687eb97cfae2d5641269e1c0c74eefc',
          language: 'en-US',
        },
      })
      .then((response) => {
        const selectedMovie = response.data;
        const genreIds = selectedMovie.genres.map((genre) => genre.id);
  
     
        axios
          .get('https://api.themoviedb.org/3/discover/movie', {
            params: {
              api_key: '5687eb97cfae2d5641269e1c0c74eefc',
              language: 'en-US',
              with_genres: genreIds.join(','),
            },
          })
          .then((response) => {
            const similarMovies = response.data.results.filter(
              (movie) => movie.id !== selectedMovie.id
            );
  
            setSimilarMovies(similarMovies);
          })
          .catch((error) => {
            console.error('Error fetching similar movies:', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching movie details:', error);
      });
  };
  
  const getVideo = (movieId) => {
    axios
      .get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
        params: {
          api_key: '5687eb97cfae2d5641269e1c0c74eefc',
          language: 'en-US',
        },
      })
      .then((response) => {
        const videos = response.data.results;
        if (videos.length > 0) {
          const videoKey = videos[0].key;
          const videoUrl = getVideoUrl(videoKey);
          console.log(videoUrl)
          setTrailerUrl(videoUrl);
        } else {
          console.log('No video trailers available for this movie.');
        }
      })
      .catch((error) => {
        console.error('Error fetching movie videos:', error);
      });
  };

  const formatReleaseDate = (date) => {
    const year = new Date(date).getFullYear();
    return year.toString();
  };
  showFullText = (value) =>{
    setMore(!value);
  }

  const getVideoUrl = (key) => `${YOUTUBE_BASE_URL}?v=${key}`;

  const handlePlayClick = () => {
    if (trailerUrl) {
  
      Linking.openURL(trailerUrl).catch((error) => {
        console.error('Error opening URL:', error);
      });
    } else {
      Alert.alert( 'There is no trailer available for this movie.');

    }
  };
  const handleBackClick = () => {
  navigation.goBack();
};

  const addToFav = async () => {
    try {
      const isAlreadyInFavorites = favoritesArray.some((favorite) => favorite.id === movie.id);
  
      if (!isAlreadyInFavorites) {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        let updatedFavoritesArray = [];
  
        if (storedFavorites) {
          updatedFavoritesArray = JSON.parse(storedFavorites);
        }

        updatedFavoritesArray.push(movie);
  
        await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavoritesArray));
  
     
        Alert.alert( `${movie.original_title} has been saved.` );
        console.log(updatedFavoritesArray);
  
        setFavoritesArray(updatedFavoritesArray);
  
       
      } else {
        Alert.alert( `${movie.original_title} has been already saved.` );
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };
  
  

  
  return (
    <ScrollView>
     
  
     <TouchableOpacity style={styles.backButton} onPress={handleBackClick}>
        <Icon2 name="arrow-back-outline" size={35} color="lightgrey"  style={{marginLeft:3}}/> 
        </TouchableOpacity> 
  
        <TouchableOpacity style={styles.backButton2} onPress={addToFav}>
        <Icon name="bookmark-o" size={30} style={{marginLeft:4}} color="lightgrey" />
        </TouchableOpacity>
    
        
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
        }}
        style={{ width: 380, height: 450, resizeMode: 'cover', display:'block' }}
      />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{movie.original_title}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.releaseDate}>
          {formatReleaseDate(movie.release_date)}
        </Text>
        <Text style={styles.genre}>
          . {movie.genres?.map((genre) => genre.name).join(', ')}
        </Text>
      </View>
  
      <View style={styles.buttonsContainer}>
  {trailerUrl ? (
    <TouchableOpacity style={styles.btn} onPress={handlePlayClick}>
      <Icon name="play" size={16} color="white" style={{ marginLeft: 15 }} />
      <Text style={styles.text}>Play</Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity style={styles.btn_disactivated} onPress={handlePlayClick} >
      <Icon name="play" size={16} color="white" style={{ marginLeft: 15 }} />
      <Text style={styles.text}>Play</Text>
    </TouchableOpacity>
  )}


        
        <TouchableOpacity style={styles.btn2}>
          <Icon name="heart" size={16} color="white" style={{marginLeft:10}} />
          <Text style={styles.text}>Favorite</Text>
        </TouchableOpacity>
      </View>
  
      <Text style={styles.textsContainer}>
  {movie.overview  && movie.overview.length > 100 ? (
    <Text style={styles.overview}>
      {more ? fullText : text}..
      <TouchableOpacity
        style={{ marginTop: -3.5 }}
        onPress={() => showFullText(more)}
      >
        <Text style={{ color: '#ff4d4d' }}>
          {more ? 'Read Less' : 'Read More'}
        </Text>
      </TouchableOpacity>
    </Text>
  ) : movie.overview}
</Text>

      
     

     <Text style={styles.similarText}>Similar Movies</Text>

<FlatList style={styles.LatestList}
              data={similarMovies.filter((movie) => movie.poster_path)} 
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


     
     
    </ScrollView>
  );
  
};

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: 10,
    color: '#000',
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: 21,
    color: '#000',
  },
  releaseDate: {
    fontSize: 14,
    marginVertical: 10,
    marginLeft: 20,
  },
  genre: {
    fontSize: 14,
    marginVertical: 10,
    width:350
  },
  overview: {
    fontSize: 15,
    
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  infoContainer: {
    marginTop: 5,
    display: 'flex',
    flexDirection: 'row',
  },
  btn: {
    backgroundColor: '#ff4d4d',
    padding: 8,
    borderRadius: 15,
    width: 110,
    display:'flex',
    flexDirection:'row',
   
  },
  btn_disactivated:{
    backgroundColor: '#ff4d4d',
    padding: 8,
    borderRadius: 15,
    width: 110,
    display:'flex',
    flexDirection:'row',
    opacity:0.5
  },
  btn2: {
    backgroundColor: '#004080',
    padding: 8,
    borderRadius: 15,
    width: 110,
    display:'flex',
    flexDirection:'row'
  },
  text: {
    color: '#fff',
    marginLeft: 10,
  },
  textsContainer:{
    display:'flex',
    flexDirection:'row',
    marginLeft:10
  },
  backButton:{
    position:'absolute',
    marginTop:50,
    zIndex:1,
    marginLeft:25,
    backgroundColor:'grey',
    opacity:0.5,
    borderRadius:20,
    width:40,
  },
  backButton2:{
    position:'absolute',
    marginTop:50,
    zIndex:1,
    marginLeft:310,
    backgroundColor:'grey',
    opacity:0.5,
    borderRadius:20,
    padding:5,
    width:40
  },
  similarText:{
    marginTop:18,
    marginLeft:130,
    marginBottom:12,
    color:'#004080'
  },
  LatestList: {
    marginTop: 10,
    marginLeft: 10,
    marginBottom:10

  },
});

export default VideoCard;
