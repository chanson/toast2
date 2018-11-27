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

import BaseForm from './base_form'
import FormItem from './form_item'
import FormSectionHeader from './form_section_header'
import FormSeparator from './form_separator'
import ListFooter from './list_footer'
import OnboardingButton from './onboarding_button'

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
    paddingTop: 70
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

class NewWedding extends BaseForm {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props)

    this.state = {
      vendor: props.navigation.state.params.vendor,
      bg_1: '',
      bg_2: '',
      date: '',
      email: '',
      errors: {
        bg_1: '',
        bg_2: '',
        date: '',
        email: ''
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.contentBottomWrapper}>
          <View style={styles.listWrapper}>
            <SectionList
              ItemSeparatorComponent={FormSeparator}
              ListFooterComponent={ListFooter}
              renderSectionHeader={FormSectionHeader}
              renderItem={({item}) => <FormItem
                field={item.field}
                id={item.key}
                secure={item.secure}
                error={this.state.errors[item.key]}
                datepicker={item.datepicker}
                keyboardType={item.keyboardType}
                handleChange={this.handleChange.bind(this)}/>}
              scrollEnabled={false}
              sections={[
                {
                  data: [
                    { field: "Bride / Groom", key: 'bg_1', required: true },
                    { field: "Bride / Groom", key: 'bg_2' },
                    { field: 'Contact Email', key: 'email', keyboardType: 'email-address', required: true },
                    { field: 'Wedding Date', key: 'date', datepicker: true, required: true }
                  ],
                  key: 'details',
                  title: 'Wedding Details:'
                }
              ]}
              style={styles.list}
            />
          </View>
          <OnboardingButton
            onPress={ this._validateFormAndCreateWedding.bind(this) }
            text="Create Wedding"
          />
        </View>
      </View>
    )
  }

  _navigateDashboard = () => {
    console.log('navigating')
    console.log(this.props.navigation)
    this.props.navigation.navigate('VendorDashboardNav')
  }

  _createWedding = () => {
    firebase.firestore().collection('users').where('email', '==', this.state.email).get().then((users) => {
      if (users.docs.length > 0) {
        const user = users.docs[0]
        const userData = user.data()

        if (userData.wedding_id != null && userData.wedding_id != undefined) {
          firebase.firestore().
            collection('wedding_todos').
            where('wedding_id', '==', userData.wedding_id).
            where('vendor', '==', true).
            where('vendor_category', '==', this.state.vendor.data().category).get().then((todos) => {
              if (todos.docs.length > 0) {
                const todo = todos.docs[0]

                if (todo.data().vendor_id == null) {
                  todo.ref.update({ vendor_id: this.state.vendor.id})

                  vendorWeddingIds = (this.state.vendor.data().wedding_ids || []).concat(wedding.id)
                  this.state.vendor.ref.update({ wedding_ids: vendorWeddingIds })

                  this._navigateDashboard()

                  return
                } else {
                  // FIXME: raise some sort of error so this anomaly can be investigated
                }
              }
              // Will execute if there are no todos for the category, or the todo for the category already exists
              firebase.firestore().collection('weddings').add({
                bride_groom_1: this.state.bg_1,
                bride_groom_2: this.state.bg_2,
                date: this.state.date
              }).then((wedding) => {
                vendorWeddingIds = (this.state.vendor.data().wedding_ids || []).concat(wedding.id)
                this.state.vendor.ref.update({ wedding_ids: vendorWeddingIds })

                this._navigateDashboard()
              })
            })
        } else { // User has not created a wedding yet
          firebase.firestore().collection('weddings').add({
            bride_groom_1: this.state.bg_1,
            bride_groom_2: this.state.bg_2,
            date: this.state.date
          }).then((wedding) => {
            user.ref.update({ wedding_id: wedding.id })

            vendorWeddingIds = (this.state.vendor.data().wedding_ids || []).concat(wedding.id)
            this.state.vendor.ref.update({ wedding_ids: vendorWeddingIds })

            this._navigateDashboard()
          })
        }
      } else {
        firebase.firestore().collection('users').add({
          email: this.state.email
        }).then((user) => {
          firebase.firestore().collection('weddings').add({
            bride_groom_1: this.state.bg_1,
            bride_groom_2: this.state.bg_2,
            date: this.state.date
          }).then((wedding) => {
            console.log(this.state.vendor)
            user.update({ wedding_id: wedding.id })

            vendorWeddingIds = (this.state.vendor.data().wedding_ids || []).concat(wedding.id)
            this.state.vendor.ref.update({ wedding_ids: vendorWeddingIds })

            this._navigateDashboard()
          })
        })
      }
    })
  }

  _validateFormAndCreateWedding = () => {
    let errors = {}
    const requiredFields = ['date', 'bg_1', 'email']

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
        this._createWedding()
      }
    })
  }
}

module.exports = NewWedding;
