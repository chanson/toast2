import React, { Component } from 'react';
import {
  Image,
  ListItem,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import firebase from 'react-native-firebase';

import BaseForm from '../components/base_form';
import FormItem from '../components/form_item';
import FormSectionHeader from '../components/form_section_header';
import FormSeparator from '../components/form_separator';
import ListFooter from '../components/list_footer';
import OnboardingButton from '../components/onboarding_button';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#92D6EA',
    flex: 1
  },
  contentBottomWrapper: {
    alignItems: 'center',
    flex: 0.7
  },
  contentTopWrapper: {
    alignItems: 'center',
    flex: 0.3,
    paddingVertical: 20
  },
  list: {
    alignSelf: 'stretch',
    borderBottomColor: '#CCCCCC'
  },
  listWrapper: {
    flexDirection: 'row',
    marginBottom: 30
  },
  title: {
    fontFamily: 'Avenir',
    fontSize: 48,
    fontWeight: '300',
    paddingBottom: 15
  }
});

class Signup extends BaseForm {
  static navigationOptions = {
    header: null
  }

  constructor() {
    super()
    this.state = {
      email: '',
      password: ''
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.contentTopWrapper}>
          <Text style={styles.title}>Toast</Text>
          <Image style={{width: 100, height: 100}} source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Toast-2.jpg/1920px-Toast-2.jpg'}}/>
        </View>
        <View style={styles.contentBottomWrapper}>
          <View style={styles.listWrapper}>
            <SectionList
              ItemSeparatorComponent={FormSeparator}
              ListFooterComponent={ListFooter}
              renderSectionHeader={FormSectionHeader}
              renderItem={({item}) => <FormItem field={item.field} id={item.key} secure={item.secure} keyboardType={item.keyboardType} handleChange={this.handleChange.bind(this)}/>}
              scrollEnabled={false}
              sections={[
                {
                  data: [
                    { field: 'Email Address', keyboardType: 'email-address', key: 'email' },
                    { field: 'Password', secure: true, key: 'password' }
                  ],
                  key: 'login',
                  title: 'Log In:'
                }
              ]}
              style={styles.list}
            />
          </View>
          <OnboardingButton
            onPress={ this._logIn }
            text='Log In'
          />
        </View>
      </View>
    )
  }

  _logIn = () => {
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).
      then((user) => console.log('log in successful') )
  }

  _renderItemComponent = ({item}) => (
    <ItemComponent item={item} onPress={this._pressItem} />
  );
}

module.exports = Signup;
