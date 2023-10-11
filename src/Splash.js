
import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const Splash = () => {
    const navigation = useNavigation();
    const splashImageURL = './images/wallpaper.jpg';



  useEffect(() => {
    const delay = 4000;
    const timer = setTimeout(() => {
      navigation.navigate('MovieList');
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>Welcome</Text> */}
      <View style={styles.ImageContainer}>
      <Image
  source={require('./images/wallpaper.jpg')}
  style={styles.image}
/>
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 400,
    height: 850,
   
  },
  text:{
    color:'#ff4d4d',
    position:'absolute',
    zIndex:1,
    fontSize:45,
    fontWeight:'bold',
    backgroundColor:'#fff',
  },
  ImageContainer:{
    display:'block'
  }
});

export default Splash;
