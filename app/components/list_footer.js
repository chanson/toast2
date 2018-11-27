import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#CCCCCC',
    height: 1
  }
});

const ListFooter = ({section}) => (
  <View style={styles.footer}/>
);

export default ListFooter;
