import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';

const styles = StyleSheet.create({
  separatorInner: {
    backgroundColor: '#CCCCCC',
    height: 1,
    marginLeft: 15
  },
  separatorOuter: {
    backgroundColor: '#EBF3F6',
    height: 1
  }
});

const FormSeparator = ({item}) => (
  <View style={styles.separatorOuter}>
    <View style={styles.separatorInner}/>
  </View>
);

export default FormSeparator;
