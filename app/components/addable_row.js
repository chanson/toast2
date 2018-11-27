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

const goToAddTodo = ( navigation, parentId, vendorId, weddingId, hideAddVendor ) => {
  navigation.navigate('NewTodoLandingNav', { parentId: parentId, vendorId: vendorId, weddingId: weddingId, hideAddVendor: hideAddVendor })
}

const AddableRow = ({ title, navigation, parentId, vendorId, weddingId, hideAddVendor, }) => (
  <View style={styles.header}>
    <View style={styles.textWrapper}>
      <Text style={styles.text}>{title}</Text>
    </View>
    <TouchableOpacity
      style={styles.iconWrapper}
      onPress={() => { goToAddTodo(navigation, parentId, vendorId, weddingId, hideAddVendor) }}
    >
      <Icon
        name='add-circle-outline'
        type='material-icons'
      />
    </TouchableOpacity>
  </View>
);

export default AddableRow;
