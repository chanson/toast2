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
import { TextField } from 'react-native-material-textfield'

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
  inputWrapper: {
    backgroundColor: '#EBF3F6',
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
    borderTopColor: '#CCCCCC',
    borderTopWidth: 1,
    marginTop: 20,
    paddingLeft: 25,
  }
});

class TodoNotes extends BaseForm {
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
      title: 'Notes',
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
      loaded: false,
      todo: undefined,
      note: ''
    }
  }

  _submitForm = () => {
    this.setState({ ...this.state, loaded: false }, () => {
      this.state.todo.update({ note: this.state.note }).then(() => {
        this.setState({ ...this.state, loaded: true })
      })
    })
  }

  componentDidMount() {
    this.props.navigation.setParams({ submitForm: this._submitForm.bind(this) });
    const todoId = this.props.navigation.state.params.todoId
    firebase.firestore().collection('wedding_todos').doc(todoId).get().then((todo) => {
      this.setState({
        ...this.state,
        loaded: true,
        todo: todo.ref,
        note: todo.data().note || ''
      })
    })
  }

  _updateForm = (text) => {
    this.setState({ ...this.state, note: text })
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
          <View style={styles.inputWrapper}>
            <TextField
              keyboardType={this.props.keyboardType}
              label='Note:'
              labelHeight={18}
              onChangeText={ this._updateForm }
              value={this.state.note}
              multiline={true}
              containerStyle={{paddingVertical: 10}}
            />
          </View>
        </View>
      )
    }
  }
}

module.exports = TodoNotes;
