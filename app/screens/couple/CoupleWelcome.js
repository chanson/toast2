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

class CoupleWelcome extends BaseForm {
  static navigationOptions = {
    header: null
  }

  constructor() {
    super()
    this.state = {
      future_spouse: '',
      date: '',
      errors: {
        future_spouse: '',
        date: ''
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.contentTopWrapper}>
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles.description}>
            Get started by telling us{'\n'}
            a little about your event:
          </Text>
        </View>
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
                    { field: "Fiancée / Fiancé", key: 'future_spouse' },
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

  _navigateDashboard = () => {
    this.props.navigation.navigate('DashboardNav')
  }

  _updateWedding = () => {
    // FIXME: Add loader here before kicking off firestore request
    firebase.firestore().collection('weddings').where('user_id', '==', this.props.screenProps.user.data().user_auth_uid).get().then((docs) => {
      const wedding = docs.docs[0]

      wedding.ref.update({
        bride_groom_2: this.state.future_spouse,
        date: this.state.date
      }).then(res => {
        this.props.screenProps.user.ref.update({ wedding_id: wedding.id, completed_ftu: true, completed_ftu_at: new Date() })
        this._navigateDashboard()
      })
    })
  }

  _validateFormAndCreateWedding = () => {
    let errors = {}
    const requiredFields = ['date']

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
        this._updateWedding()
      }
    })
  }
}

module.exports = CoupleWelcome;
