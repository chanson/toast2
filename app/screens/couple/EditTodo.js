import React, { Component } from 'react';

import TodoForm from '../../components/todo_form'

class EditTodo extends Component {
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
    console.log(this.props.navigation)
    return (
      <TodoForm
        navigation={this.props.navigation}
        submitText='Update Task'
        title='Edit Task:'
        todoId={this.props.navigation.state.params.todoId}
        todoName='Name'
      />
    )
  }
}

module.exports = EditTodo
