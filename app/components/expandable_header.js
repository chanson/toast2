import React, { Component } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Icon } from 'react-native-elements'

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#B3D5D6',
    borderColor: '#CCCCCC',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingHorizontal: 15,
    height: 47,
    flexDirection: 'row'
  },
  textWrapper: {
    justifyContent: 'center'
  },
  iconWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1
  },
  text: {
    alignItems: 'flex-start',
    fontFamily: 'Avenir',
    fontSize: 17,
    fontWeight: '300'
  }
});

class ExpandableHeader extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    console.log(this.props)
    this._togglePositionAnim = new Animated.Value(this.props.isActive ? 1 : 0)
  }

  componentWillReceiveProps(nextProps) {
    Animated.timing(
      this._togglePositionAnim,
      {
        toValue: nextProps.isActive ? 1 : 0,
        duration: 400,
      }
    ).start()
  }

  render() {
    let iconStyle = { transform: [
      { rotate: this._togglePositionAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '90deg']
        })
      },
      { perspective: 1000 }
    ]}

    return (
      <View style={styles.header}>
        <View style={styles.textWrapper}>
          <Text style={styles.text}>{this.props.section.title}</Text>
        </View>
        <View style={styles.iconWrapper}>
          <Animated.View
            style={[
              iconStyle
            ]}
          >
            <Icon name='keyboard-arrow-right'/>
          </Animated.View>
        </View>
      </View>
    )
  }
}

export default ExpandableHeader
