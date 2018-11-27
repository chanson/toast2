import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import OnboardingButton from '../components/onboarding_button'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flex: 1,
    justifyContent: 'center'
  }
});

class NewTodoLanding extends Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: '#92D6EA',
      paddingHorizontal: 15,
    }
  }

  render() {
    const navParams = this.props.navigation.state.params
    console.log('todo landing: ')
    console.log(navParams)
    return (
      <View style={styles.container}>
        <OnboardingButton
          onPress={() => this.props.navigation.navigate('NewTodo', {
            parentId: navParams.parentId,
            vendorId: navParams.vendorId,
            weddingId: navParams.weddingId
          })}
          text='New Todo'
        />
        <OnboardingButton
          onPress={() => this.props.navigation.navigate('NewPayment', {
            parentId: navParams.parentId,
            vendorId: navParams.vendorId,
            weddingId: navParams.weddingId
          })}
          text='New Payment'
        />
        {!this.props.navigation.state.params.hideAddVendor && <OnboardingButton
          text='New Vendor'
          onPress={() => this.props.navigation.navigate('NewVendor', {
            parentId: navParams.parentId,
            vendorId: navParams.vendorId,
            weddingId: navParams.weddingId
          })}
        />}
      </View>
    )
  }
}

module.exports = NewTodoLanding;
