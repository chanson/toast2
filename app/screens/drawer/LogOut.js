import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native'
import firebase from 'react-native-firebase';

const styles = StyleSheet.create({
  button: {
    color: '#2196f3',
    fontWeight: 'bold',
    margin: 16
  }
})

class LogOut extends Component {
  static navigationOptions = {
    drawerLabel: 'Log Out'
  }

  _logOut() {
    firebase.auth().signOut()
  }

  render() {
    return(
      <TouchableOpacity
        onPress={ this._logOut.bind(this) }
      >
        <Text style={styles.button}>Log Out</Text>
      </TouchableOpacity>
    )
  }
}

module.exports = LogOut
