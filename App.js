/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  ActivityIndicator,
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

// import * as firebase from 'firebase';
import firebase from 'react-native-firebase';
import {
  DrawerStack,
  LandingNav,
  WelcomeNav,
  VendorDashboardNav,
  VendorWelcomeNav
} from './app/config/router'

class App extends React.Component {

  constructor() {
    super();
    this.unsubscriber = null;
    this.state = {
      authUser: null,
      loading: false
    };
  }

  /**
   * Listen for any auth state changes and update component state
   */
  componentDidMount() {
    this.unsubscriber = firebase.auth().onAuthStateChanged((authUser) => {
      this.setState({
        ...this.state,
        authUser: authUser,
        loading: true
      }, () => {
        if (!this.state.authUser) {
          this.setState({
            ...this.state,
            user: null,
            loading: false
          })
        } else {
          firebase.firestore().collection('users').doc(this.state.authUser.uid).get().then((user) => {
            console.log('ftu: ' + user.data().completed_ftu)
            console.log(user)
            this.setState({
              ...this.state,
              completedFtu: user.data().completed_ftu,
              loading: false,
              user: user,
            })
          })
        }
      })
    });
  }

  componentWillUnmount() {
    if (this.unsubscriber) {
      this.unsubscriber();
    }
  }

  render() {
    if (this.state.loading) {
      // FIXME: make this prettier
      return(
        <View>
          <ActivityIndicator size='large' color='#0000ff' style={{marginTop: 50}} />
        </View>
      )
    } else if (!this.state.authUser) {
      return <LandingNav />
    } else if (this.state.user.data().vendor) {
      if (!this.state.completedFtu) {
        return <VendorWelcomeNav screenProps={{ user: this.state.user }} />
      } else {
        return (
          <VendorDashboardNav />
        )
      }
    } else {
      console.log(this.state.user)
      if (!this.state.completedFtu) {
        return <WelcomeNav screenProps={{ user: this.state.user }} />
      } else {
        return (
          <DrawerStack />
        );
      }
    }
  }
}


AppRegistry.registerComponent('Toast', () => App);
