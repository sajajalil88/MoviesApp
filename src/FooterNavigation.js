// FooterNavigation.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';



const FooterNavigation = ({marginTop, height}) => {
  const navigation = useNavigation();

  const footerStyle = {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#004080',
    borderTopWidth: 1,
    borderColor: 'lightgray',
    paddingVertical: 10,
    marginTop: marginTop, // Use the marginTop prop here
    padding: 10,
    height: height,
  };

  const showSaved = () =>{
navigation.navigate('FavoritesList');
  }


  return (
    <View style={[footerStyle]}>
      <TouchableOpacity style={styles.footerItem}>
        <Icon name="home" size={25} color="white" />
        <Text style={styles.footerText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerItem}>
        <Icon name="search" size={25} color="white" />
        <Text style={styles.footerText}>Search</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={showSaved} style={styles.footerItem}>
        <Icon name="bookmark" size={25} color="white" />
        <Text style={styles.footerText}>Saved</Text>
      </TouchableOpacity>
      <TouchableOpacity  style={styles.footerItem}>
        <Icon name="star" size={25} color="white" />
        <Text style={styles.footerText}>Favorites</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerItem}>
        <Icon name="person" size={25} color="white" />
        <Text style={styles.footerText}>Me</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#004080',
    borderTopWidth: 1,
    borderColor: 'lightgray',
    paddingVertical: 10,
    marginTop: -80,
    padding: 10,
    height: 80,
    
  },
  footerItem: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#fff'
  },
});

export default FooterNavigation;
