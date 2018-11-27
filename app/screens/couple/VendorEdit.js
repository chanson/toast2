import React, { Component } from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  ListItem,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Icon } from 'react-native-elements'
import firebase from 'react-native-firebase'
import moment from 'moment'

import AddableHeader from '../../components/addable_header'
import BaseForm from '../../components/base_form'
import ChecklistItem from '../../components/checklist_item'
import FormItem from '../../components/form_item';
import FormSectionHeader from '../../components/form_section_header';
import FormSeparator from '../../components/form_separator';
import ListFooter from '../../components/list_footer';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1
  },
  contentWrapper: {
    alignItems: 'center',
    flex: 1,
    paddingTop: 20
  },
  dollarsWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1
  },
  list: {
    alignSelf: 'stretch',
    borderBottomColor: '#CCCCCC'
  },
  listWrapper: {
    flexDirection: 'row'
  }
});

class VendorEdit extends BaseForm {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      headerRight: (
        <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={ params.submitForm }>
          <Text>Save</Text>
          <Icon name='check' color='#000'/>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#92D6EA',
        paddingHorizontal: 15,
      },
      headerTintColor: '#000',
      headerTitleStyle: {
        fontFamily: 'Avenir',
        fontWeight: '300',
        fontSize: 17
      },
      title: 'Edit Vendor',
      headerBackTitleStyle: {
        fontFamily: 'Avenir',
        fontWeight: '300',
        fontSize: 17
      }
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      loaded: true,
      todo: undefined,
      vendorId: undefined,
      company_name: '',
      contact_name: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      payments: []
    }
  }

  _setVendorDetails = ( vendorId ) => {
    this.state.todo.ref.update({
      vendor_details: {
        company_name: this.state.company_name,
        contact_name: this.state.contact_name,
        email: this.state.email,
        address: this.state.address,
        city: this.state.city,
        state: this.state.state,
        zip: this.state.zip,
      },
      vendor_id: vendorId
    })
  }

  _submitForm = () => {
    // FIXME: Add loader here before kicking off firestore request
    // FIXME: Add indication of successful save
    email = this.state.email.toLowerCase()
    firebase.firestore().collection('vendors').where('email', '==', email).get().then((docs) => {
      if(docs.docs.length > 0) {
        this._setVendorDetails(docs.docs[0].uid)
        // FIXME: update vendor wedding_ids
      } else {
        firebase.firestore().collection('vendors').add({
          email: email,
          name: this.state.contact_name,
          company: this.state.company_name,
          wedding_ids: [this.state.todo.data().wedding_id]
        }).then((vendor) => {
          this._setVendorDetails(vendor.id)
          this._updatePaymentsVendorId(vendor.id)
        })
      }
    })
  }

  _updatePaymentsVendorId = (vendorId) => {
    firebase.firestore().collection('wedding_todos').where('parent_id', '==', this.props.navigation.state.params.todoId).get().then((docs) => {
      docs.forEach((doc) => {
        doc.ref.update({ vendor_id: vendorId })
      })
    })
  }

  componentDidMount() {
    this.props.navigation.setParams({ submitForm: this._submitForm.bind(this) });
    const todoId = this.props.navigation.state.params.todoId
    firebase.firestore().collection('wedding_todos').doc(todoId).get().then((todo) => {
      const vendorInfo = todo.data().vendor_details || {}
      let payments = [] //FIXME: make const

      firebase.firestore().collection('wedding_todos').where('parent_id', '==', todoId).get().then((docs) => {
        docs.forEach((doc) => {
          const payment = doc.data()

          const data = {
            complete: payment.complete,
            id: doc.id,
            key: doc.id,
            date: payment.date,
            task: payment.text
          }

          payments = payments.concat(data)
        })

        this.setState({
          ...this.state,
          todo: todo,
          vendorId: todo.data().vendor_id,
          weddingId: todo.data().wedding_id,
          loaded: true,
          company_name: vendorInfo.company_name,
          contact_name: vendorInfo.contact_name,
          email: vendorInfo.email,
          address: vendorInfo.address,
          city: vendorInfo.city,
          state: vendorInfo.state,
          zip: vendorInfo.zip,
          payments: payments
        })
      })
    })
  }

  _renderPayments = () => {
    return(
      this.state.payments.map((payment) => {
        return (
          <View key={payment.id} style={[styles.list, { height: 47 }]}>
            <ChecklistItem
              isChecked={payment.complete}
              key={payment.id}
              date={moment(payment.date).format('MM/DD/YYYY')}
              task={`$${payment.task}`}
              rightComponent={
                <View style={styles.dollarsWrapper}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('EditPayment', { todoId: payment.id })}
                    style={styles.leftIcon}
                  >
                    <Icon
                      name='calendar-edit'
                      type='material-community'
                    />
                  </TouchableOpacity>
                </View>
              }
            />
          </View>
        )
      })
    )
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
          <View style={styles.contentWrapper}>
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
                      />
                    )
                  }
                }
                scrollEnabled={false}
                sections={[
                  {
                    data: [
                      { field: 'Company Name', key: 'company_name' },
                      { field: 'Contact Name', key: 'contact_name' },
                      { field: 'Contact Email', keyboardType: 'email-address', key: 'email' },
                      { field: 'Address', key: 'address' },
                      { field: 'City', key: 'city' },
                      { field: 'State', key: 'state' },
                      { field: 'Zip', key: 'zip' }
                    ],
                    key: 'details',
                    title: 'Vendor Details:'
                  }
                ]}
                style={styles.list}
              />
            </View>
            <AddableHeader
              title='Payments:'
              navigation={this.props.navigation}
              parentId={this.props.navigation.state.params.todoId}
              vendorId={this.state.vendorId}
              weddingId={this.state.weddingId}
            />
            {this._renderPayments()}
          </View>
        </View>
      )
    }
  }
}

module.exports = VendorEdit;
