
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
import pointsGarbage from './screen/pointsGarbage';
import ScheduleGarbage from './screen/ScheduleGarbage';
import ScanTrash from './screen/ScanTrash';
import inputOTP from './screen/inputOTP';
import PostSchedule from './screen/PostSchedule';
function App() {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="PhoneAuth" component={PhoneAuth} options={{headerShown:false}}/>
        <Stack.Screen name="login" component={login} options={{headerShown:false}}/>
        <Stack.Screen name="bottomNavigation" component={bottomNavigation} options={{ headerShown:false}}/>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="user" component={user} />
        <Stack.Screen name="register" component={register} />
        <Stack.Screen name="ScanGarbage" component={ScanGarbage} /> 
        <Stack.Screen name="ResultScreen" component={ResultScreen} />
        <Stack.Screen name="setting" component={setting} />
        <Stack.Screen name="PaymentQRCode" component={PaymentQRCode} options={{headerShown:false}}/>
        <Stack.Screen name="ScanQRCode" component={ScanQRCode} options={{headerShown:false}}/>
        <Stack.Screen name="pointsGarbage" component={pointsGarbage} />
        <Stack.Screen name="ScheduleGarbage" component={ScheduleGarbage} />
        <Stack.Screen name="ScanTrash" component={ScanTrash} />
        <Stack.Screen name="inputOTP" component={inputOTP}/>
        <Stack.Screen name="PostSchedule" component={PostSchedule} />
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
