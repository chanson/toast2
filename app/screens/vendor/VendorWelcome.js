import React, { Component } from 'react'
import {
  ActivityIndicator,
  Image,
  ListItem,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import firebase from 'react-native-firebase'

import BaseForm from '../../components/base_form'
import FormItem from '../../components/form_item'
import FormSectionHeader from '../../components/form_section_header'
import FormSeparator from '../../components/form_separator'
import ListFooter from '../../components/list_footer'
import OnboardingButton from '../../components/onboarding_button'
import { ALL as VENDOR_CATEGORIES } from '../../config/vendor_categories'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#92D6EA',
    flex: 1
  },
  contentBottomWrapper: {
    alignItems: 'center',
    flex: 0.8
  },
  contentTopWrapper: {
    alignItems: 'center',
    flex: 0.2,
    paddingVertical: 23
  },
  description: {
    fontFamily: 'Avenir',
    fontSize: 17,
    fontWeight: '300'
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

class VendorWelcome extends BaseForm {
  static navigationOptions = {
    header: null
  }

  constructor() {
    super()
    this.state = {
      // loaded: false,
      loaded: true, // FIXME
      company_name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      category: '',
      errors: {
        company_name: '',
        address: '',
        city: '',
        state: '',
        zip: ''
      }
    }
  }

  render() {
    if(!this.state.loaded) {
      return(
        <View style={styles.container}>
          <View style={styles.contentWrapper}>
            <ActivityIndicator size='large' color='#0000ff' />
          </View>
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.contentTopWrapper}>
            <Text style={styles.title}>Welcome!</Text>
            <Text style={styles.description}>
              Get started by telling us{'\n'}
              a little about your company:
            </Text>
          </View>
          <View style={styles.contentBottomWrapper}>
            <View style={styles.listWrapper}>
              <SectionList
                ItemSeparatorComponent={FormSeparator}
                ListFooterComponent={ListFooter}
                renderSectionHeader={FormSectionHeader}
                renderItem={({item}) => {
                    return(
                      <FormItem
                        initialValue={this.state[item.key]}
                        field={item.field}
                        id={item.key}
                        secure={item.secure}
                        keyboardType={item.keyboardType}
                        handleChange={this.handleChange.bind(this)}
                        picker={item.picker}
                        pickerData={item.pickerData}
                      />
                    )
                  }
                }
                scrollEnabled={false}
                sections={[
                  {
                    data: [
                      { field: 'Company Name', key: 'company_name' },
                      { field: 'Vendor Category', key: 'category', picker: true, pickerData: VENDOR_CATEGORIES },
                      { field: 'Address', key: 'address' },
                      { field: 'City', key: 'city' },
                      { field: 'State', key: 'state' },
                      { field: 'Zip', key: 'zip' },
                    ],
                    key: 'details',
                    title: 'Vendor Details:'
                  }
                ]}
                style={styles.list}
              />
            </View>
            <OnboardingButton
              onPress={ this._validateFormAndCreateOrUpdateVendor.bind(this) }
              text="Let's Go!"
            />
            <OnboardingButton
              onPress={ this._navigateDashboard.bind(this) }
              text='Skip for Now'
            />
          </View>
        </View>
      )
    }
  }

  _navigateDashboard = () => {
    this.props.navigation.navigate('VendorDashboardNav')
  }

  _findOrCreateVendor = () => {
    // FIXME: Add loader here before kicking off firestore request
    const userData = this.props.screenProps.user.data()
    const email = userData.email.toLowerCase()
    const name = userData.first_name + ' ' + userData.last_name
    firebase.firestore().collection('vendors').where('email', '==', email).get().then((docs) => {
      if(docs.docs.length > 0) {
        docs.docs[0].ref.update({
          category: this.state.category,
          company_name: this.state.company_name,
          contact_name: name,
          email: email,
          address: this.state.address,
          city: this.state.city,
          state: this.state.state,
          zip: this.state.zip
        })
        this.props.screenProps.user.ref.update({ vendor_id: docs.docs[0].id, completed_ftu: true, completed_ftu_at: new Date() })
        this._navigateDashboard()
      } else {
        firebase.firestore().collection('vendors').add({
          category: this.state.category,
          company_name: this.state.company_name,
          contact_name: name,
          email: email,
          address: this.state.address,
          city: this.state.city,
          state: this.state.state,
          zip: this.state.zip
        }).then((vendor) => {
          this.props.screenProps.user.ref.update({ vendor_id: vendor.id, completed_ftu: true, completed_ftu_at: new Date() })
          this._navigateDashboard()
        })
      }
    })
  }

  _validateFormAndCreateOrUpdateVendor = () => {
    let errors = {}
    const requiredFields = ['category']

    requiredFields.forEach((field) => {
      if(this.state[field] == '') {
        errors[field] = "can't be blank"
      } else {
        errors[field] = ''
      }
    })

    this.setState({
      ...this.state,
      errors: errors
    }, () => {
      if(Object.values(this.state.errors).some((val) => val != '')) {
        return
      } else {
        this._findOrCreateVendor()
      }
    })
  }
}

module.exports = VendorWelcome;
