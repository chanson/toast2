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
    backgroundColor: '#B3D5D6',
    borderColor: '#CCCCCC',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingHorizontal: 15,
    height: 47,
    flexDirection: 'row',
  },
  text: {
    fontFamily: 'Avenir',
    fontSize: 17,
    fontWeight: '300'
  },
  textWrapper: {
    justifyContent: 'center'
  },
  iconWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1
  }
});

const goToAddTodo = ( navigation, parentId, vendorId, weddingId ) => {
  navigation.navigate('NewTodo', { parentId: parentId, vendorId: vendorId, weddingId: weddingId })
}

const AddableHeader = ({ title, navigation, parentId, vendorId, weddingId, goToAdd }) => (
  <View style={styles.header}>
    <View style={styles.textWrapper}>
      <Text style={styles.text}>{title}</Text>
    </View>
    <TouchableOpacity
      style={styles.iconWrapper}
      onPress={() => {
        if(goToAdd == undefined) {
          goToAddTodo(navigation, parentId, vendorId, weddingId)
        } else {
          goToAdd()
        }
      }}
    >
      <Icon
        name='add-circle-outline'
        type='material-icons'
      />
    </TouchableOpacity>
  </View>
);

export default AddableHeader;
