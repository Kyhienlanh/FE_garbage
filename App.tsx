
import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View ,Text, Settings} from 'react-native';
import HomeScreen from './screen/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import bottomNavigation from './screen/bottomNavigation';
import user from './screen/user';
import login from './screen/login';
import register from './screen/register';
import ScanGarbage from './screen/ScanGarbage';
import PhoneAuth from './screen/PhoneAuth';
import ResultScreen from './screen/ResultScreen';
import setting from './screen/setting';
import PaymentQRCode from './screen/PaymentQRCode';
import ScanQRCode from './screen/ScanQRCode';
function App() {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <NavigationContainer>
      <Stack.Navigator>
         <Stack.Screen name="login" component={login} options={{headerShown:false}}/>
        <Stack.Screen name="bottomNavigation" component={bottomNavigation} options={{ headerShown:false}}/>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="user" component={user} />
        <Stack.Screen name="register" component={register} />
        <Stack.Screen name="ScanGarbage" component={ScanGarbage} /> 
        <Stack.Screen name="PhoneAuth" component={PhoneAuth} />
        <Stack.Screen name="ResultScreen" component={ResultScreen} />
        <Stack.Screen name="setting" component={setting} />
        <Stack.Screen name="PaymentQRCode" component={PaymentQRCode} />
        <Stack.Screen name="ScanQRCode" component={ScanQRCode} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
// screenOptions={{ headerShown: false }}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
