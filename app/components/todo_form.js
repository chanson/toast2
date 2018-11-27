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
import firebase from 'react-native-firebase'
import moment from 'moment'

import AddableHeader from './addable_header'
import BaseForm from './base_form'
import ChecklistItem from './checklist_item'
import FormItem from './form_item'
import FormSectionHeader from './form_section_header'
import FormSeparator from './form_separator'
import ListFooter from './list_footer'
import OnboardingButton from './onboarding_button'

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
  list: {
    alignSelf: 'stretch',
    borderBottomColor: '#CCCCCC'
  },
  listWrapper: {
    flexDirection: 'row',
    marginBottom: 30
  }
});

class TodoForm extends BaseForm {
  // static navigationOptions = {
  //   headerStyle: {
  //     backgroundColor: '#92D6EA',
  //     paddingHorizontal: 15
  //   },
  //   headerTintColor: '#000',
  //   headerTitleStyle: {
  //     fontFamily: 'Avenir',
  //     fontWeight: '300',
  //     fontSize: 17
  //   },
  //   title: 'New Task'
  // }

  constructor(props) {
    super(props)
    this.state = {
      date: '',
      todo: '',
      todoRef: undefined
    }
  }

  componentDidMount() {
    if(this.props.todoId !== undefined) {
      firebase.firestore().collection('wedding_todos').doc(this.props.todoId).get().then((todo) => {
        const todoData = todo.data()
        console.log(todoData)
        console.log(todoData.text)
        this.setState({
          ...this.state,
          date: todoData.date,
          todo: todoData.text,
          todoRef: todo.ref
        })
      })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <View style={styles.listWrapper}>
            <SectionList
              ItemSeparatorComponent={FormSeparator}
              ListFooterComponent={ListFooter}
              renderSectionHeader={FormSectionHeader}
              renderItem={({item}) => (
                <FormItem
                  field={item.field}
                  id={item.key}
                  initialValue={this.state[item.key]}
                  secure={item.secure}
                  keyboardType={item.keyboardType}
                  handleChange={this.handleChange.bind(this)}
                  datepicker={item.datepicker}
                />)
              }
              scrollEnabled={false}
              sections={[
                {
                  data: [
                    { field: this.props.todoName, key: 'todo' },
                    { field: 'Date', key: 'date', datepicker: true }
                  ],
                  key: 'new_todo',
                  title: this.props.title
                }
              ]}
              style={styles.list}
            />
          </View>
          <OnboardingButton
            onPress={ this._addTask.bind(this) }
            text={this.props.submitText}
          />
        </View>
      </View>
    )
  }

  _addTask = () => {
    weddingId = this.props.navigation.state.params.weddingId

    // FIXME: Add loader here before kicking off firestore request
    firebase.firestore().collection('weddings').doc(weddingId).get().then((wedding) => {
      console.log(this.state.date)
      date = moment(this.state.date, 'MM/DD/YYYY hh:mm A')
      daysBeforeWedding = moment(wedding.data().date, 'MM/DD/YYYY hh:mm A').diff(date, 'days')

      if (this.state.todoRef === undefined) {
        firebase.firestore().collection('wedding_todos').add({
          user_id: firebase.auth().currentUser.uid,
          text: this.state.todo,
          date: date.toDate(),
          days_before_wedding: daysBeforeWedding,
          complete: false,
          type: this.props.type,
          vendor: false, // FIXME: add vendor toggle
          vendor_id: this.props.navigation.state.params.vendorId,
          parent_id: this.props.navigation.state.params.parentId,
          wedding_id: weddingId
        }).then((todo) => {
          console.log(todo.id)
          this.props.navigation.goBack(this.props.navigation.state.key)
        })
      } else {
        this.state.todoRef.update({
          text: this.state.todo,
          date: date.toDate()
        }).then(() => {
          this.props.navigation.goBack(this.props.navigation.state.key)
        })
      }
    })
  }
}

module.exports = TodoForm;
