
import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View ,Text} from 'react-native';
import HomeScreen from './screen/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import bottomNavigation from './screen/bottomNavigation';
import user from './screen/user';
import login from './screen/login';
import register from './screen/register';
import ScanGarbage from './screen/ScanGarbage';
import PhoneAuth from './screen/PhoneAuth';
function App() {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
         <Stack.Screen name="login" component={login} />
        <Stack.Screen name="bottomNavigation" component={bottomNavigation} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="user" component={user} />
        <Stack.Screen name="register" component={register} />
        <Stack.Screen name="ScanGarbage" component={ScanGarbage} /> 
        <Stack.Screen name="PhoneAuth" component={PhoneAuth} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
