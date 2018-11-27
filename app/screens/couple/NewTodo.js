import React, { Component } from 'react'
import {
  Text,
  TouchableOpacity
} from 'react-native'

import TodoForm from 'app/components/todo_form'
import { TASK } from 'app/config/todo_types'

class NewTodo extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <TouchableOpacity onPress={() => {
          navigation.goBack(navigation.state.key)
        } }>
          <Text>Back</Text>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#92D6EA',
        paddingHorizontal: 15
      },
      headerTintColor: '#000',
      headerTitleStyle: {
        fontFamily: 'Avenir',
        fontWeight: '300',
        fontSize: 17
      },
      title: 'New Todo'
    }
  }

  render() {
    return (
      <TodoForm
        navigation={this.props.navigation}
        submitText='Add Task'
        title='Add New Task:'
        todoName='Name'
        type={TASK}
      />
    )
  }
}

module.exports = NewTodo
