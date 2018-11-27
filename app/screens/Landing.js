import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Signup from './Signup';
import OnboardingButton from '../components/onboarding_button'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#92D6EA',
    flex: 1
  },
  contentWrapper: {
    alignItems: 'center',
    flex: 0.5
  },
  logo: {
    height: 150,
    width: 150
  },
  title: {
    fontFamily: 'Avenir',
    fontSize: 48,
    fontWeight: '300',
    paddingBottom: 30
  },
  upperContent: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

class Landing extends Component {
  static navigationOptions = {
    header: null
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <View style={styles.upperContent}>
            <Text style={styles.title}>Toast</Text>
            <Image
              style={styles.logo}
              source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Toast-2.jpg/1920px-Toast-2.jpg'}}
            />
          </View>
        </View>
        <View style={styles.contentWrapper}>
          <OnboardingButton
            onPress={() => this.props.navigation.navigate('Signup')}
            text='Sign Up'
          />
          <OnboardingButton
            text='Log In'
            onPress={() => this.props.navigation.navigate('Login')}
          />
        </View>
      </View>
    )
  }
}

module.exports = Landing;
