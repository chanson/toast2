import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import PropTypes from 'prop-types';

import Checkbox from './checkbox'

const styles = StyleSheet.create({
  checkbox: {
    alignItems: 'flex-start',
    backgroundColor: '#EBF3F6',
    marginLeft: 0,
    marginRight: 0,
    padding: 0
  },
  row: {
    alignItems: 'stretch',
    backgroundColor: '#EBF3F6',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    flex: 1,
    flexDirection: 'row',
    margin: 0,
    paddingHorizontal: 16,
    paddingVertical: 5
  },
  text: {
    fontFamily: 'Avenir',
    fontWeight: '300'
  },
  textWrapper: {
    justifyContent: 'center'
  }
});

class ChecklistItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <View style={styles.row}>
        <Checkbox
          containerStyle={styles.checkbox}
          id={this.props.id}
          isChecked={this.props.isChecked}
          checkedIcon='check-circle'
          uncheckedIcon='check-circle-o'
        />
        <View style={styles.textWrapper}>
          <Text style={styles.text}>
            {this.props.date}
          </Text>
          <Text style={styles.text}>
            {this.props.task}
          </Text>
        </View>
        {this.props.rightComponent}
      </View>
    );
  }
}

ChecklistItem.propTypes = {
}

export default ChecklistItem;
