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
  calculateDate
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
  loaderWrapper: {
    marginTop: 50
  },
  title: {
    fontFamily: 'Avenir',
    fontSize: 48,
    fontWeight: '300',
    paddingBottom: 15
  },
  weddingWeekButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: -15
  }
})

class Dashboard extends Component {
  // static navigationOptions = {
  //   drawerLabel: 'Dashboard',
  //   headerBackTitle: 'Dashboard',
  //   title: '276 Days to Go!'
  // }

  static navigationOptions = ({ navigation }) => {
    return {
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
      headerLeft: <Icon
        name='menu'
        onPress={() => navigation.navigate('DrawerOpen')}
      />,
      title: ''
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
        }, () => {
          this._setTitle()
          this._buildChecklists()
        })
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
    return (
      <View style={{height: month.data.length * 47}}>
        {month.data.map((item) => {
          const displayDate = extractDisplayDate(item, this.state.wedding)

          return (
            <ChecklistItem
              isChecked={item.complete}
              date={displayDate}
              id={item.id}
              key={item.key}
              task={item.task}
              rightComponent={
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
              }
            />
          )}
        )}
      </View>
    )
  }

  _setSection(section) {
    this.setState({ activeSection: section });
  }

  _setTitle() {
    const days = this._countDaysUntilWedding()
    console.log(this.props.navigation)
    console.log(days)
    console.log(this.navigationOptions)
    console.log(this.props.navigation.setParams({ title: 'hello' }))
  }

  _countDaysUntilWedding() {
    if(this.state.wedding === undefined) {
      return undefined
    } else {
      return moment(this.state.wedding.date, 'MM/DD/YYYY hh:mm A').diff(moment(), 'days')
    }
  }

  render() {
    let content = (
      <View style={styles.loaderWrapper}>
        <ActivityIndicator size='large' color='#0000ff' />
      </View>
    )

    if (this.state.loaded) {
      const weddingPlanButton = this._countDaysUntilWedding() <= 30 && (
        <View style={styles.weddingWeekButtonWrapper}>
          <OnboardingButton
            onPress={ () => { this.props.navigation.navigate('WeddingWeekDash', { weddingId: this.state.weddingId }) } }
            text="View Wedding Week Plan"
          />
        </View>
      )

      content = (
        <View style={styles.listWrapper}>
          {weddingPlanButton}
          <AddableHeader title='Wedding Checklist:' navigation={this.props.navigation} vendorId={undefined} weddingId={this.state.weddingId}/>
          <Accordion
            sections={this.state.months}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent.bind(this)}
            duration={400}
            onChange={this._setSection.bind(this)}
            style={styles.list}
          />
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

module.exports = Dashboard;
