import { Platform, StyleSheet, Text, View ,TouchableOpacity} from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './HomeScreen';
import ScanGarbage from './ScanGarbage';
import setting from './setting';
const Tab=createBottomTabNavigator();

const bottomNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Transactions':
              iconName = focused ? 'list' : 'list-outline';
              break;
            case 'Reports':
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
              break;
            case 'setting':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return (
            <Ionicons name={iconName} size={focused ? 28 : 24} color={color} />
          );
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Transactions" component={HomeScreen} />

      <Tab.Screen
        name="ScanGarbage"
        component={ScanGarbage}
        options={{
          tabBarButton: (props: any) => (
            <TouchableOpacity
              {...props}
              style={styles.fabButton}
              activeOpacity={0.7}
            >
              <Ionicons name="camera" size={32} color="#fff" />
            </TouchableOpacity>
          ),
          animation:'fade'
        }}
      />
      <Tab.Screen name="Reports" component={HomeScreen} />
      <Tab.Screen name="setting" component={setting} />
      
    </Tab.Navigator>
  );
};

export default bottomNavigation;

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 55,
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    position: 'absolute',
    paddingBottom: Platform.OS === 'android' ? 5 : 20,
  },
  fabButton: {
    top: -25,
    justifyContent: 'center',
    alignItems: 'center',
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: 'green',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    left: 10,
    elevation: 10,
  },
});