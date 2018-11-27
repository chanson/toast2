import React, { Component } from 'react'
import {
  DatePickerIOS,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from 'react-native'
import PropTypes from 'prop-types'
import DatePicker from 'react-native-datepicker'
import { Dropdown } from 'react-native-material-dropdown'
import { TextField } from 'react-native-material-textfield'
import moment from 'moment'

const styles = StyleSheet.create({
  error: {
    marginLeft: 25
  },
  header: {
    backgroundColor: '#EBF3F6'
  },
  text: {
    fontFamily: 'Avenir',
    fontWeight: '300',
    // height: 44,
    color: '#999999',
    justifyContent: 'center',
    // paddingTop: 18,
    fontSize: 16
  },
  input: {
    marginLeft: 25,
    borderBottomWidth: 1
  },
  inputNoError: {
    borderBottomWidth: 0
  },
  row: {
    alignItems: 'stretch',
    backgroundColor: '#EBF3F6',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    // flex: 1,
    flexDirection: 'row',
    margin: 0,
    paddingVertical: 5,
    justifyContent: 'center',
    paddingRight: 16
  },
  textWrapper: {
    justifyContent: 'center'
  },
  checkboxLabel: {
    alignItems: 'flex-start',
    backgroundColor: '#EBF3F6',
    marginLeft: 0,
    marginRight: 0,
    paddingHorizontal: 25,
    paddingVertical: 5,
    height: 44,
    // justifyContent: 'center'
  },
})

class FormItem extends Component {
  constructor(props) {
    super(props)
    this.state = { text: props.initialValue, error: props.error }
  }

  componentWillReceiveProps(nextProps) {
    let newState = {}

    if(this.state.text == undefined || this.state.text == '') {
      if (nextProps.initialValue instanceof Date) {
        newState['text'] = moment(nextProps.initialValue, 'MM/DD/YYYY hh:mm A').format('MM/DD/YYYY hh:mm A')
      } else {
        newState['text'] = nextProps.initialValue
      }
    }

    this.setState({
      ...this.state,
      ...newState,
      error: nextProps.error
    })
  }

  _updateForm = (text) => {
    this.setState({ ...this.state, text: text }, () => {
      this.props.handleChange(text, this.props.id)
    })
  }

  _openDatePicker = () => {
    this.datepicker.onPressDate()
  }

  _inputStyle = () => {
    if(this.state.error == '' || this.state.error == undefined) {
      return [styles.input, styles.inputNoError]
    } else {
      return styles.input
    }
  }

  _dateValue(text) {
    if(text === undefined) {
      return text
    } else {
      return moment(this.state.text, 'MM/DD/YYYY hh:mm A').format('MM/DD/YYYY hh:mm A')
    }
  }

  render() {
    if(this.props.datepicker) {
      return(
        <View style={styles.header}>
          <DatePicker
            style={{height: 0}}
            ref={(ref) => this.datepicker = ref}
            date={this.state.text}
            mode='datetime'
            placeholder='select date'
            format='MM/DD/YYYY hh:mm A'
            minDate={moment().format('MM/DD/YYYY hh:mm A')}
            confirmBtnText='Confirm'
            cancelBtnText='Cancel'
            onDateChange={this._updateForm.bind(this)}
            showIcon={false}
            customStyles={{
              dateInput: {
                display: 'none'
              }
            }}
          />
          <TextField
            keyboardType={this.props.keyboardType}
            label={this.props.field}
            labelHeight={18}
            labelTextStyle={styles.text}
            inputContainerStyle={this._inputStyle()}
            inputContainerPadding={this.state.error == '' ? 0 : 5}
            secureTextEntry={this.props.secure}
            value={this._dateValue(this.state.text)}
            titleTextStyle={styles.error}
            error={this.state.error}
            onFocus={this._openDatePicker.bind(this)}
          />
        </View>
      )
    } else if(this.props.checkbox) {
      return(
        <View style={[styles.header, styles.row]}>
          <View style={styles.checkboxLabel}>
            <Text style={[styles.text, { paddingTop: 10 }]}>{this.props.field}</Text>
          </View>
          <View style={{alignItems: 'flex-end', flex: 1, justifyContent: 'center'}}>
            <Switch
              value={this.state.text}
              onValueChange={ this._updateForm }
            />
          </View>
        </View>
      )
    } else if(this.props.picker) {
      const data = this.props.pickerData.map(value => ({ value: value }))

      return(
        <View style={styles.header}>
          <Dropdown
            error={this.state.error}
            labelHeight={18}
            labelTextStyle={styles.text}
            titleTextStyle={styles.error}
            inputContainerStyle={this._inputStyle()}
            inputContainerPadding={this.state.error == '' ? 0 : 5}
            data={data}
            label={this.props.field}
            onChangeText={ this._updateForm }
            value={this.state.text}
          />
        </View>
      )
    } else {
      return(
        <View style={styles.header}>
          <TextField
            error={this.state.error}
            keyboardType={this.props.keyboardType}
            label={this.props.field}
            labelHeight={18}
            labelTextStyle={styles.text}
            titleTextStyle={styles.error}
            inputContainerStyle={this._inputStyle()}
            inputContainerPadding={this.state.error == '' ? 0 : 5}
            onChangeText={ this._updateForm }
            secureTextEntry={this.props.secure}
            value={this.state.text}
          />
        </View>
      )
    }
  }
}

FormItem.propTypes = {
  secureField: PropTypes.bool,
}

export default FormItem;
