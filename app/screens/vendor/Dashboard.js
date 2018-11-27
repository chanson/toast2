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
import Q from 'q'

import AddableHeader from '../../components/addable_header'
import AddableRow from '../../components/addable_row'
import ChecklistItem from 'app/components/checklist_item'
import DefaultRow from 'app/components/default_row'
import FormItem from '../../components/form_item'
import ExpandableHeader from '../../components/expandable_header'

import {
  calculateDate
} from 'app/utils/todoHelpers'

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
  empty: {
    paddingTop: 20,
    textAlign: 'center'
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
  title: {
    fontFamily: 'Avenir',
    fontSize: 48,
    fontWeight: '300',
    paddingBottom: 15
  }
})

class Dashboard extends Component {
  static navigationOptions = {
    drawerLabel: 'Dashboard',
    headerBackTitle: 'Dashboard',
    title: '276 Days to Go!'
  }

  constructor(props) {
    super(props);
    this._navigateTask = this._navigateTask.bind(this);
    this.state = {
      loaded: false,
      weddings: [],
      vendor: undefined,
      user: undefined
    }
  }

  componentDidMount() {
    firebase.firestore().collection('users').where('user_auth_uid', '==', firebase.auth().currentUser.uid).get().then((vendorUser) => {
      // FIXME: this doesn't actually seem to do anything, it will always be true?
      if(vendorUser.docs[0] !== undefined) {
        this.setState({
          ...this.state,
          user: vendorUser.docs[0].data()
        }, () => {
          firebase.firestore().collection('vendors').doc(this.state.user.vendor_id).get().then((vendor) => {
            if(vendor !== undefined) {
              this.setState({
                ...this.state,
                vendor: vendor
              }, this._buildWeddings )
            } else {
              // TODO: raise an error
            }
          })
        })
      } else {
        // TODO: raise an error
      }
    })
  }

  _buildWeddings() {
    let weddings = {}
    let weddingKeys = {}
    let weddingDates = {}

    // FIXME: move to util
    // FIXME: subscribe and set loader until results are present, then unsubscribe
    const weddingIds = this.state.vendor.data().wedding_ids || []

    const getWeddings = weddingIds.map((weddingId) => {
      return firebase.firestore().collection('weddings').doc(weddingId).get()
    })

    // FIXME: figure out how to catch errors in here
    Q.all(getWeddings).then((weddingDocs) => {
      const getTodos = weddingDocs.map((weddingDoc) => {
        const weddingData = weddingDoc.data()
        const weddingId = weddingDoc.id

        let weddingDate = moment(weddingData.date, 'MM/DD/YYYY hh:mm A')
        let bg2 = undefined

        if(weddingData.bride_groom_2.length > 0) {
          let bg2arr = weddingData.bride_groom_2.split(' ')
          if (bg2arr.length > 1) {
            bg2arr.shift()
          }
          bg2 = '/' + bg2arr.join('-')
        }

        let bg1arr = weddingData.bride_groom_1.split(' ')
        if (bg1arr.length > 1) {
          bg1arr.shift()
        }
        let nameKey = bg1arr.join('-')

        if (bg2 !== undefined) {
          nameKey += bg2
        }

        const weddingKey = weddingDate.format('YYYY[_]MM[_]DD') + '--' + nameKey
        console.log(weddingKey)
        weddingKeys[weddingId] = weddingKey
        weddingDates[weddingId] = weddingDate

        weddings = {
          ...weddings,
          [weddingKey]: {
            id: weddingId,
            todos: []
          }
        }

        return firebase.firestore().collection('wedding_todos').where('vendor_id', '==', this.state.vendor.id).where('wedding_id', '==', weddingId).get()
      })

      Q.all(getTodos).then((todoSnapshot) => {
        todoSnapshot.forEach((todoDocs) => {
          // if(todoDocs.length === undefined) {
          //   return;
          // }
          let todos = []
          let weddingKey = undefined
          let weddingId = undefined

          todoDocs.forEach((doc) => {
            const todo = doc.data()
            weddingId = todo.wedding_id

            // FIXME: use the helper?
            // const dueDate = calculateDate(todo, this.state.wedding)
            let dueDate = moment().add(1, 'y').subtract(todo.days_before_wedding, 'days')

            // FIXME: store and use the wedding date if available
            if(weddingDates[weddingId] !== undefined) {
              dueDate = moment(weddingDates[weddingId], 'MM/DD/YYYY hh:mm A').subtract(todo.days_before_wedding, 'days')
            }

            if(todo.date !== undefined && todo.date !== '' && todo.date !== null) {
              dueDate = moment(todo.date, 'MM/DD/YYYY hh:mm A')
            }

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

            // not dryable code

            todos = todos.concat(data)

            weddingKey = weddingKeys[weddingId]
          })
          console.log(weddingKey)
          weddings = {
            ...weddings,
            [weddingKey]: {
              id: weddingId,
              todos: todos
            }
          }
        })

        const formattedWeddings = Object.keys(weddings).sort().map(function(key) {
          const details = key.split('--')
          const date = details[0]

          const brideGroom = details[1]
          const titleFull = moment(date, 'YYYY[_]MM[_]DD').format('MMM[ ]DD[, ]YYYY[ - ]') + brideGroom
          let title = titleFull

          if (titleFull.length > 35) {
            title = titleFull.substring(0, 35) + '...'
          }

          const weddingDetails = weddings[key]

          return {
            data: weddingDetails.todos,
            id: weddingDetails.id,
            key: key,
            title: title + ':'
          }
        })

        this.setState({
          ...this.state,
          loaded: true,
          weddings: formattedWeddings
        })
      }).catch((error) => {console.log(error)})
    })
  }

  _navigateTask = (id, isVendor, weddingId) => {
    console.log('navigating: ' + weddingId)
    if (isVendor) {
      this.props.navigation.navigate('Vendor', { todoId: id, weddingId: weddingId })
    } else {
      this.props.navigation.navigate('TodoNotes', { todoId: id, weddingId: weddingId })
    }
  }

  _goToAddWedding = () => {
    console.log('going to addWedding screen')
    this.props.navigation.navigate('NewWedding', { vendor: this.state.vendor })
  }

  _renderContent(wedding, i, isActive) {
    console.log('wedding:')
    console.log(wedding)

    if (wedding.data.length == 0) {
      // FIXME: clean up by making a component that gets rendered by ChecklistItem; for now it's ugly
      return (
        <View>
          <AddableRow
            title='Add new task'
            navigation={this.props.navigation}
            hideAddVendor={true}
            vendorId={this.state.vendor.id}
            weddingId={wedding.id}
          />
          <DefaultRow text='No tasks for this wedding'/>
        </View>
      )
    }

    return (
      <View style={{height: (wedding.data.length + 1) * 47}}>
        <AddableRow
          title='Add new task:'
          navigation={this.props.navigation}
          hideAddVendor={true}
          vendorId={this.state.vendor.id}
          weddingId={wedding.id}
        />
        {wedding.data.map((item) => {
          displayDate = moment(item.date).format('MM/DD/YYYY')
          console.log('wedding id for todo: ' + wedding.id)
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
                      onPress={() => this.props.navigation.navigate(item.editScreen, { todoId: item.id, weddingId: wedding.id })}
                      style={styles.leftIcon}
                    >
                      <Icon
                        name='calendar-edit'
                        type='material-community'
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this._navigateTask(item.id, item.isVendor, wedding.id)}
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

  _renderHeader(wedding, i, isActive) {
    return (
      <View>
        <ExpandableHeader section={wedding} isActive={isActive}/>
      </View>
    );
  }


  _setSection(section) {
    this.setState({ activeSection: section });
  }

  render() {
    let content = <ActivityIndicator size='large' color='#0000ff' />

    if (this.state.loaded) {
      let innerContent = <Text style={[styles.description, styles.empty]}>You have no active weddings.</Text>

      if (this.state.weddings.length > 0) {
        innerContent = <Accordion
          sections={this.state.weddings}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent.bind(this)}
          duration={400}
          onChange={this._setSection.bind(this)}
          style={styles.list}
        />
      }
      content = (
        <View style={styles.listWrapper}>
          <AddableHeader title='My Weddings:' navigation={this.props.navigation} goToAdd={this._goToAddWedding}/>
          {innerContent}
        </View>
      )
    }

    // <Header
    //   leftComponent={{ icon: 'menu', color: '#000', onPress: () => this.props.navigation.navigate('DrawerOpen') }}
    //   centerComponent={{ text: '276 Days to Go!', style: { color: '#000', fontFamily: 'Avenir', fontWeight: '300', fontSize: 17 } }}
    //   rightComponent={{ icon: 'face', color: '#000' }}
    //   outerContainerStyles={styles.header}
    // />

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
