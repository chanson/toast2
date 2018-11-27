import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Icon } from 'react-native-elements'

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#EBF3F6',
    borderColor: '#CCCCCC',
    borderBottomWidth: 1,
    paddingHorizontal: 15,
    height: 47,
    flexDirection: 'row',
  },
  text: {
    fontFamily: 'Avenir',
    fontSize: 17,
    fontStyle: 'italic',
    fontWeight: '300'
  },
  textWrapper: {
    justifyContent: 'center'
  }
});

const DefaultRow = ({ text }) => (
  <View style={styles.header}>
    <View style={styles.textWrapper}>
      <Text style={styles.text}>{ text }</Text>
    </View>
  </View>
);

export default DefaultRow;
