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
import * as EmailValidator from 'email-validator'

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
    this.ref = firebase.firestore().collection('users')
    this.state = {
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      vendor: false,
      errors: {
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        vendor: ''
      }
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
              renderItem={({item}) =>
                <FormItem
                  field={item.field}
                  id={item.key}
                  error={this.state.errors[item.key]}
                  checkbox={item.checkbox}
                  secure={item.secure}
                  keyboardType={item.keyboardType}
                  handleChange={this.handleChange.bind(this)}/>}
              scrollEnabled={false}
              sections={[
                {
                  data: [
                    { field: 'First Name', key: 'first_name', required: true },
                    { field: 'Last Name', key: 'last_name', required: true },
                    { field: 'Email Address', keyboardType: 'email-address', key: 'email', required: true },
                    { field: 'Password', secure: true, key: 'password', required: true },
                    { field: 'I am a Vendor', key: 'vendor', checkbox: true }
                  ],
                  key: 'signup',
                  title: 'Sign Up:'
                }
              ]}
              style={styles.list}
            />
          </View>
          <OnboardingButton
            onPress={ this._validateFormAndSignUp }
            text='Register'
          />
        </View>
      </View>
    )
  }

  _signUp = () => {
    const email = this.state.email.toLowerCase()
    firebase.auth().createUserWithEmailAndPassword(email, this.state.password).
      then((user) => {
        user.updateProfile({ displayName: this.state.first_name + ' ' + this.state.last_name })
        this.ref.doc(user.uid).set({
          user_auth_uid: user.uid,
          completed_ftu: false,
          completed_ftu_at: null,
          email: email,
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          vendor: this.state.vendor
        }).then((doc) => console.log('user created'))

        firebase.firestore().collection('weddings').add({
          user_id: user.uid,
          bride_groom_1: this.state.first_name + ' ' + this.state.last_name,
          bride_groom_2: '',
          date: ''
        })
      }).
      catch((error) => console.log(error)) // FIXME: do something with the error, e.g. "email already taken"
  }

  _validateFormAndSignUp = () => {
    let errors = {}
    const requiredFields = ['first_name', 'last_name', 'email', 'password']

    requiredFields.forEach((field) => {
      if(this.state[field] == '') {
        errors[field] = "can't be blank"
      } else {
        errors[field] = ''
      }
    })

    if(this.state.password.length > 0 && this.state.password.length < 8) {
      const passwordLengthError = 'must be 8 characters or longer'

      if(this.state.errors.password == '') {
        errors.password = passwordLengthError
      } else {
        errors.password = errors.password + '; ' + passwordLengthError
      }
    }

    if(this.state.email.length > 0 && !EmailValidator.validate(this.state.email)) {
      const invalidEmailError = 'must be a valid email'

      if(this.state.errors.email == '') {
        errors.email = invalidEmailError
      } else {
        errors.email = errors.email + '; ' + invalidEmailError
      }
    }

    this.setState({
      ...this.state,
      errors: errors
    }, () => {
      if(Object.values(this.state.errors).some((val) => val != '')) {
        return
      } else {
        this._signUp()
      }
    })
  }

  _renderItemComponent = ({item}) => (
    <ItemComponent item={item} onPress={this._pressItem} />
  );
}

module.exports = Signup;
