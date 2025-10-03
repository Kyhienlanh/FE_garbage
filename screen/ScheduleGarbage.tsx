import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { use, useCallback, useEffect, useState } from 'react'
import config from '../config/config';
import { User } from '../types/User';
import auth, { validatePassword } from '@react-native-firebase/auth';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import { WasteCollectionSchedule } from '../types/WasteCollectionSchedule';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform } from 'react-native';
  const ScheduleGarbage = () => {
      const navigation: NavigationProp<RootStackParamList> = useNavigation();
      const [schedules, setSchedules] = useState<WasteCollectionSchedule[]>([]);
      const [userID, setUserID] = useState<string>('');
      const [latitude, setlatitude] = useState<number>(10.984131);
      const [longitude, setlongitude] = useState<number>(106.630349);
      const [wasteType,setwasteType]=useState();
      const [scheduledDate, setScheduledDate] = useState(new Date());
      const [status,setsstatus]=useState(); 
      const [notes,setNotes]=useState<string>();
      const [showDatePicker, setShowDatePicker] = useState(false);
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Quyền truy cập vị trí',
            message: 'Ứng dụng cần quyền truy cập vị trí của bạn',
            buttonNeutral: 'Hỏi sau',
            buttonNegative: 'Hủy',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        return true; // iOS tự hỏi permission
      }
    };
       useEffect(() => {
    const getCurrentLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        console.warn('Không có quyền truy cập vị trí');
        return;
      }

      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Vị trí hiện tại:', latitude, longitude);
          setlatitude(latitude);
          setlongitude(longitude);
        },
        (error) => {
          console.error('Lỗi lấy vị trí:', error);
        },
         { enableHighAccuracy: false, timeout: 30000, maximumAge: 10000 }
      );
    };

    getCurrentLocation();
  }, []);

    const handleDateChange = (event:any, selectedDate:any) => {
        const currentDate = selectedDate || scheduledDate;
        setShowDatePicker(false);
        setScheduledDate(currentDate);
      };
      

    useEffect(() => {
        const fetchUserData = async () => {
          const currentUser = auth().currentUser;
          if (currentUser) {
            const value = await getData('userID');
            setUserID(value ?? '');
            getScheduleGarbage(value || 's');
          }
        };
        fetchUserData();
      }, []);

      const getData = async (key: string) => {
        try {
          const value = await AsyncStorage.getItem(key);
          return value;
        } catch (error) {
          console.error('Lỗi khi lấy dữ liệu:', error);
          return null;
        }
      };

      const test=()=>{
        schedules.forEach(element => {
          console.log(element.notes)
        });
      }
      const getScheduleGarbage =async(userID:string)=>{
            axios.get(`${config.API_BASE_URL}/WasteCollectionSchedules/GetdataUserID/${userID}`)
            .then(Response=>{
              setSchedules(Response.data)
              console.log(Response.data);
            })
            .catch(error=>{
              console.error("loi khi load api",error)
            })
      };
      const postScheduleGarbage=async()=>{
        try{
          const newSchedule = {
            userID: userID,
            latitude: 10.762622,
            longitude: 106.660172,
            wasteType: 'Organic',
            scheduledDate: '2025-10-05T08:00:00',
            status: 'Pending',
            notes: 'Leave at front gate',
          };
          const response=await axios.post(`${config.API_BASE_URL}/WasteCollectionSchedules`,newSchedule)
           console.log('Created:', response.data);
        }catch(error){
            console.error('Error creating schedule:', error);
        }
      }
    return (
      <View style={styles.container}>
        <RNPickerSelect
        onValueChange={(value) => setwasteType(value)}
        items={[
          { label: 'Tái chế', value: 'Tái chế' },
          { label: 'Hữu cơ', value: 'Hữu cơ' },
          { label: 'Nguy hại', value: 'Nguy hại' },
          { label: 'Tổng hợp', value: 'Tổng hợp' },
          { label: 'Khác', value: 'Khác' },
        ]}
        placeholder={{ label: 'Chọn loại rác...', value: null }}
        style={pickerSelectStyles}
      />

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
        <Text>Chọn ngày: {scheduledDate.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={scheduledDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Ghi chú thêm"
        value={notes}
        onChangeText={setNotes}
      />
      
      <Text>Latitude: {latitude}</Text>
      <Text>Longitude: {longitude}</Text>
    

      <TouchableOpacity>
        <Text>Đặt lịch</Text>
      </TouchableOpacity>

      <FlatList
          data={schedules}
          keyExtractor={(item, index) => 
            item.scheduleID ? item.scheduleID.toString() : index.toString()
          }
          renderItem={({ item }) => (
            <View style={styles.scheduleItem}>
              <Text>🗑 Loại rác: {item.wasteType || 'Không có'}</Text>
              <Text>
                📅 Ngày: {item.scheduledDate 
                  ? new Date(item.scheduledDate).toLocaleDateString() 
                  : 'Chưa có ngày'}
              </Text>
              <Text>📝 Ghi chú: {item.notes || 'Không có'}</Text>
              <Text>📌 Trạng thái: {item.status || 'Chưa xác định'}</Text>
            </View>
          )}
        /> 
     
      </View>
    )
  }

export default ScheduleGarbage

 const styles = StyleSheet.create({
  container: {
    // padding: 20,
    // backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  dateButton: {
    padding: 10,
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    marginBottom: 15,
  },
  map: {
    height: 200,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scheduleItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#dfe6e9',
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    color: 'black',
    marginBottom: 15,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    color: 'black',
    marginBottom: 15,
  },
};