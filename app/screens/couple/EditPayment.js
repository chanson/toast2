import React, { Component } from 'react';

import TodoForm from '../../components/todo_form'

class EditPayment extends Component {
  static navigationOptions = {
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
    title: 'Edit Task'
  }

  render() {
    return (
      <TodoForm
        navigation={this.props.navigation}
        submitText='Update Payment'
        title='Edit Payment:'
        todoId={this.props.navigation.state.params.todoId}
        todoName='Amount'
      />
    )
  }
}

module.exports = EditPayment
