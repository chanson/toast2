import React, { Component } from 'react'
import {
  ActivityIndicator,
  Animated,
  FlatList,
  ListItem,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import Accordion from 'react-native-collapsible/Accordion'
import { Header, Icon } from 'react-native-elements'
import firebase from 'react-native-firebase'
import moment from 'moment'

import AddableHeader from 'app/components/addable_header'
import ChecklistItem from 'app/components/checklist_item'
import FormItem from 'app/components/form_item'
import ExpandableHeader from 'app/components/expandable_header'
import OnboardingButton from 'app/components/onboarding_button'

import {
  currentUserId,
  getWeddingsForUser,
  getWeddingTodosForUser
} from 'app/utils/firestoreQueries'
import {
  calculateDate,
  daysBetweenWedding
} from 'app/utils/todoHelpers'
import {
  extractDisplayDate
} from 'app/utils/checklistItemHelpers'

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
  description: {
    fontFamily: 'Avenir',
    fontSize: 17,
    fontWeight: '300'
  },
  flexRow: {
    alignSelf: 'stretch',
    flex: 1,
    flexDirection: 'row'
  },
  header: {
    backgroundColor: '#92D6EA'
  },
  iconContainer: {
    flexDirection: 'row'
  },
  iconWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1
  },
  leftIcon: {
    marginRight: 10
  },
  list: {
    alignSelf: 'stretch',
    borderBottomColor: '#CCCCCC'
  },
  listWrapper: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'column',
    marginBottom: 30
  },
  row: {
    // alignItems: 'stretch',
    backgroundColor: '#EBF3F6',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    // flex: 1,
    // flexDirection: 'row',
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
  },
  title: {
    fontFamily: 'Avenir',
    fontSize: 48,
    fontWeight: '300',
    paddingBottom: 15
  }
})

class WeddingWeekDash extends Component {
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
      title: 'Wedding Week'
    }
  }

  constructor(props) {
    super(props);
    this._navigateTask = this._navigateTask.bind(this);
    this.state = {
      loaded: false,
      months: [],
      wedding: undefined
    }
  }

  componentDidMount() {
    // FIXME: move wedding finding logic to util; maybe wrap in promise?
    getWeddingsForUser(currentUserId()).then((wedding) => {
      if(wedding != undefined) {
        this.setState({
          ...this.state,
          wedding: wedding.docs[0].data(),
          weddingId: wedding.docs[0].id
        }, () => this._buildChecklists())
      } else {
        this._buildChecklists()
      }
    })
  }

  _buildChecklists() {
    let months = {}

    // FIXME: subscribe and set loader until results are present, then unsubscribe
    getWeddingTodosForUser(currentUserId()).then((todoDocs) => {
      todoDocs.forEach((doc) => {
        const todo = doc.data()

        const daysBetweenTodoAndWedding = daysBetweenWedding(todo, this.state.wedding)
        if(daysBetweenTodoAndWedding > 7) {
          return
        }

        const dueDate = calculateDate(todo, this.state.wedding)
        const dateKey = dueDate.format('YYYY[_]MM')
        let text = todo.text
        let editScreen = 'EditTodo'

        if(todo.type == 'payment') {
          text = `$${todo.text}`
          editScreen = 'EditPayment'
        }

        const data = {
          daysBefore: todo.days_before_wedding,
          date: todo.date,
          complete: todo.complete,
          id: doc.id,
          key: doc.id,
          task: text,
          isVendor: todo.vendor,
          editScreen: editScreen
        }

        let monthDate = months[dateKey]
        if (monthDate === undefined) {
          monthDate = [data]
        } else {
          monthDate = monthDate.concat(data)
        }

        months = {
          ...months,
          [dateKey]: monthDate
        }
      })

      const formattedMonths = Object.keys(months).sort().map(function(key) {
        return {
          data: months[key],
          key: key,
          title: moment(key, 'YYYY[_]MM').format('MMMM[ ]YYYY[:]')
        }
      })

      this.setState({
        ...this.state,
        loaded: true,
        months: formattedMonths
      })
    })
  }

  _renderHeader(month, i, isActive) {
    return (
      <View>
        <ExpandableHeader section={month} isActive={isActive}/>
      </View>
    );
  }

  _navigateTask = (id, isVendor) => {
    if (isVendor) {
      this.props.navigation.navigate('Vendor', { todoId: id, weddingId: this.state.weddingId })
    } else {
      this.props.navigation.navigate('TodoNotes', { todoId: id, weddingId: this.state.weddingId })
    }
  }

  _renderContent(month, i, isActive) {
    return this.state.months.map((months) => {
      // console.log(months)
      return months.data.map((item) => {
        console.log(item);
        const displayDate = extractDisplayDate(item, this.state.wedding)

        const vendorInfo = item.isVendor && (
          <Text style={styles.text}>
            FIXME: Add Vendor
          </Text>
        )

        return (
          <View style={[{height: item.isVendor ? 65 : 47}, styles.row]} key={item.key}>
            <View style={styles.flexRow}>
              <View style={styles.textWrapper}>
                <Text style={styles.text}>
                  {displayDate}
                </Text>
                <Text style={styles.text}>
                  {item.task}
                </Text>
                {vendorInfo}
              </View>
              <View style={styles.iconWrapper}>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate(item.editScreen, { todoId: item.id, weddingId: this.state.weddingId })}
                    style={styles.leftIcon}
                  >
                    <Icon
                      name='calendar-edit'
                      type='material-community'
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this._navigateTask(item.id, item.isVendor)}
                  >
                    <Icon
                      name='info-outline'
                      type='material-icons'
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )
      })
    })
  }

  _setSection(section) {
    this.setState({ activeSection: section });
  }

  render() {
    let content = <ActivityIndicator size='large' color='#0000ff' />

    if (this.state.loaded) {
      // console.log('output:')
      // console.log(this._renderContent()[0])
      content = (
        <View style={styles.listWrapper}>
          <View style={styles.list}>
            <AddableHeader title='Wedding Checklist:' navigation={this.props.navigation} vendorId={undefined} weddingId={this.state.weddingId}/>
            {this._renderContent()[0]}
          </View>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          {content}
        </View>
      </View>
    )
  }
}

module.exports = WeddingWeekDash;
