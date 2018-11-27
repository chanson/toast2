import React from 'react'
import { StackNavigator } from 'react-navigation'
import Landing from '../screens/Landing'
import Login from '../screens/Login'
import Signup from '../screens/Signup'
import CoupleWelcome from '../screens/couple/CoupleWelcome'
import CoupleDashboard from '../screens/couple/Dashboard'
import VendorEdit from '../screens/couple/VendorEdit'
import NewTodo from '../screens/couple/NewTodo'
import NewPayment from '../screens/couple/NewPayment'
import LogOut from '../screens/drawer/LogOut'
import TodoNotes from '../screens/couple/TodoNotes'
import EditTodo from '../screens/couple/EditTodo'
import EditPayment from '../screens/couple/EditPayment'
import VendorWelcome from '../screens/vendor/VendorWelcome'
import VendorDashboard from '../screens/vendor/Dashboard'
import NewWedding from '../components/new_wedding'
import NewTodoLanding from 'app/screens/NewTodoLanding'
import WeddingWeekDash from 'app/screens/couple/WeddingWeekDash'

const LogOutStack = StackNavigator(
  {
      LogOut: { screen: LogOut },
      Login: { screen: Login }
  },
  {
    initialRouteName: 'LogOut'
  }
)

import { DrawerNavigator, DrawerItems } from 'react-navigation'

import {
  ScrollView,
  View
} from 'react-native'

import { Icon } from 'react-native-elements'

const VendorDrawerStack = DrawerNavigator(
  {
    Dashboard: { screen: VendorDashboard }
  },
  {
    headerMode: 'float',
    navigationOptions: ({ navigation }) => ({
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
      headerRight: <Icon
        name='face'
      />
    }),
    contentComponent:(props) => (
      <View style={{flex:1}}>
        <ScrollView forceInset={{ top: 'always', horizontal: 'never' }}>
          <DrawerItems {...props} />
          <LogOut/>
        </ScrollView>
      </View>
    )
  }
)

// const Dashboard = StackNavigator(
//   {
//     Dashboard: {
//       screen: CoupleDashboard
//     },
//     // Venue: {
//     //   screen: VendorNav
//     // }
//   },
//   {
//     initialRouteName: 'Dashboard'
//   }
// )

export const VendorNav = StackNavigator(
  {
    Vendor: {
      screen: VendorEdit
    },
    NewTodo: {
      screen: NewPayment
    },
    EditPayment: {
      screen: EditPayment
    }
  },
  {
    initialRouteName: 'Vendor',
    headerMode: 'none'
  }
)

export const TestDashboardNav = StackNavigator(
  {
    DashboardRoot: {
      screen: CoupleDashboard
    },
    Vendor: {
      screen: VendorNav
    },
    NewTodo: {
      screen: NewTodo
    },
    TodoNotes: {
      screen: TodoNotes
    },
    EditTodo: {
      screen: EditTodo
    },
    EditPayment: {
      screen: EditPayment
    },
    WeddingWeekDash: {
      screen: WeddingWeekDash
    }
  },
  {
    initialRouteName: 'DashboardRoot'
  }
)

// export const DashboardNav = StackNavigator(
//   {
//     DashboardRoot: {
//       screen: DrawerStack
//     },
//     Vendor: {
//       screen: VendorNav
//     },
//     NewTodo: {
//       screen: NewTodo
//     },
//     TodoNotes: {
//       screen: TodoNotes
//     },
//     EditTodo: {
//       screen: EditTodo
//     },
//     EditPayment: {
//       screen: EditPayment
//     },
//     WeddingWeekDash: {
//       screen: WeddingWeekDash
//     }
//   },
//   {
//     initialRouteName: 'DashboardRoot'
//   }
// )

export const NewTodoLandingNav = StackNavigator(
  {
    TodoLanding: {
      screen: NewTodoLanding
    },
    NewTodo: {
      screen: NewTodo
    },
    NewPayment: {
      screen: NewPayment
    },
    NewVendor: {
      screen: VendorEdit
    }
  },
  {
    initialRouteName: 'TodoLanding',
    headerMode: 'none'
  }
)

export const VendorDashboardNav = StackNavigator(
  {
    DashboardRoot: {
      screen: VendorDrawerStack
    },
    NewWedding: {
      screen: NewWedding
    },
    NewTodoLandingNav: {
      screen: NewTodoLandingNav
    }
  },
  {
    initialRouteName: 'DashboardRoot'
  }
)

export const DrawerStack = DrawerNavigator(
  {
    Dashboard: { screen: TestDashboardNav }
  },
  {
    headerMode: 'float',
    navigationOptions: ({ navigation }) => ({
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
      headerRight: <Icon
        name='face'
      />
    }),
    contentComponent:(props) => (
      <View style={{flex:1}}>
        <ScrollView forceInset={{ top: 'always', horizontal: 'never' }}>
          <DrawerItems {...props} />
          <LogOut/>
        </ScrollView>
      </View>
    )
  }
)

export const WelcomeNav = StackNavigator(
  {
    CoupleWelcome: {
      screen: CoupleWelcome
    },
    DashboardNav: {
      screen: DrawerStack
    }
  },
  {
    headerMode: 'none'
  }
);

export const VendorWelcomeNav = StackNavigator(
  {
    VendorWelcome: {
      screen: VendorWelcome
    },
    VendorDashboardNav: {
      screen: VendorDashboardNav
    }
  },
  {
    headerMode: 'none'
  }
)

export const LandingNav = StackNavigator(
  {
    Landing: {
      screen: Landing
    },
    Signup: {
      screen: Signup
    },
    Login: {
      screen: Login
    },
    WelcomeNav: {
      screen: WelcomeNav
    },
    VendorNav: {
      screen: VendorNav
    }
  },
  {
    initialRouteName: 'Landing',
    headerMode: 'float'
  }
);
