import { Alert, StyleSheet, Text, View, Animated, Easing, TouchableOpacity, TextInput } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useCameraPermission, Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import config from '../config/config';
import { User } from '../types/User';
import axios from 'axios';
const ScanQRCode = ({ navigation }: any) => {
  const { requestPermission } = useCameraPermission();
  const flashAnim = useRef(new Animated.Value(0)).current;
  const lineAnim = useRef(new Animated.Value(0)).current;
  const [scannerActive, setScannerActive] = useState(false); // chỉ active khi đã nhập điểm
  const [torchOn, setTorchOn] = useState(false);
  const [points, setPoints] = useState<string>(''); // số điểm nhập
  const [step, setStep] = useState<"enter" | "scan">("enter"); // step hiện tại
  const [infor,SetInfor]=useState<User>();
  const user = auth().currentUser;
  const getUser= async(uid:any) => {
      try{
          const response = await fetch(`${config.API_BASE_URL}/Users/firebase/${uid}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
          const json = await response.json();
          SetInfor(json);
      }catch(error){
        console.log('❌ getUser lỗi:', error);
      }
    }
   const totalpoint = async (uid: string, pointsToDeduct: number) => {
  try {
    const response = await axios.put(
      `${config.API_BASE_URL}/users/firebase/${uid}/deduct`,
      pointsToDeduct, 
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    console.log('User sau khi trừ điểm:', response.data);
  } catch (error: any) {
    console.error('Lỗi khi trừ điểm:', error.response?.data || error.message);
  }
};
    const totalEarnofUser=async(userID:any)=>{
        try {
            const response = await axios.post(`${config.API_BASE_URL}/rewards`, {
                UserID:Number(userID) ,          
                // CollectorID: 2,     
                PointsEarned: -Number(points),  
                CreatedAt: new Date().toISOString(),
            }, {
            headers: {
                'Content-Type': 'application/json',
            },
            });
            console.log('Reward đã tạo:', response.data);

        } catch (error: any) {
            console.error('Lỗi tạo Reward:', error.response?.data || error.message);
        }
    }

  useEffect(() => {
    const handlePermissions = async () => {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert('Không có quyền truy cập camera.');
      }
    };
    handlePermissions();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(lineAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(lineAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const device = useCameraDevice('back');

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      if (!scannerActive) return;
      const scannedValue = codes[0]?.value;

      if (scannedValue) {
        try {
          const data = JSON.parse(scannedValue);
          console.log('Scanned QR Data:', data);
          getUser(data.uid)
          const pointsOfUser = Number(infor?.points);
          const value = Number(points);
          if(value<=pointsOfUser){
             totalpoint(data.uid,value);
             totalEarnofUser(infor?.userID);
             Alert.alert('Quét thành công', `Người dùng thanh toán ${points} điểm`);
             
          }else{
             Alert.alert('Quét thất bại', `Người dùng thanh toán ${points} điểm thất bại`);
          }
        } catch (error) {
          Alert.alert('Mã QR không hợp lệ');
        }
      } else {
        Alert.alert('QR Code trống');
      }

      setScannerActive(false);
      Animated.sequence([
        Animated.timing(flashAnim, { toValue: 0.5, duration: 100, useNativeDriver: true }),
        Animated.timing(flashAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();

      setTimeout(() => setScannerActive(true), 2000);
    },
  });

  if (!device) {
    return (
      <View style={styles.center}>
        <Text>Camera Not Found</Text>
      </View>
    );
  }

  const translateY = lineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 250],
  });

  // ✅ Xử lý bước nhập điểm
  const handleProceed = () => {
    const value = Number(points);
    if (isNaN(value) || value <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số điểm hợp lệ.");
      return;
    }
    setStep("scan");
    setScannerActive(true);
  };

  // Giao diện nhập điểm
  if (step === "enter") {
    return (
      <SafeAreaView style={styles.container}>
         <View style={styles.topBar}>
                              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                                <Icon name="arrow-back" size={28} color="white" />
                              </TouchableOpacity>
        </View>
        <Text style={styles.title}>Nhập số điểm cần thanh toán</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập số điểm..."
          keyboardType="numeric"
          value={points}
          onChangeText={setPoints}
        />
        <TouchableOpacity style={styles.button} onPress={handleProceed}>
          <Text style={styles.buttonText}>Tiến hành quét QR</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Giao diện quét QR
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        torch={torchOn ? 'on' : 'off'}
        codeScanner={scannerActive ? codeScanner : undefined}
      />

      {/* Nút Back & Flash */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setStep("enter")} style={styles.iconButton}>
          <Icon name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTorchOn(!torchOn)} style={styles.iconButton}>
          <Icon name={torchOn ? 'flashlight' : 'flashlight-outline'} size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Overlay hướng dẫn */}
      <View style={styles.overlay}>
        <Text style={styles.title}>Quét mã QR</Text>
        <Text style={styles.subtitle}>Người dùng thanh toán {points} điểm</Text>

        <View style={styles.scanBox}>
          <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>

      {/* Hiệu ứng flash */}
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: 'white', opacity: flashAnim }]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#F0F5F1' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topBar: {
    position: 'absolute', top: 20, left: 0, right: 0,
    paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', zIndex: 10,
  },
  iconButton: { padding: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 30 },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 },
  title: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  subtitle: { color: 'white', fontSize: 16, marginBottom: 20, textAlign: 'center' },
  scanBox: { width: 250, height: 250, borderWidth: 2, borderColor: 'rgba(0,255,0,0.3)', borderRadius: 12, overflow: 'hidden', position: 'relative' },
  scanLine: { width: '100%', height: 2, backgroundColor: 'red', position: 'absolute', top: 0 },
  corner: { position: 'absolute', width: 30, height: 30, borderColor: '#00FF00' },
  topLeft: { top: 0, left: 0, borderLeftWidth: 4, borderTopWidth: 4 },
  topRight: { top: 0, right: 0, borderRightWidth: 4, borderTopWidth: 4 },
  bottomLeft: { bottom: 0, left: 0, borderLeftWidth: 4, borderBottomWidth: 4 },
  bottomRight: { bottom: 0, right: 0, borderRightWidth: 4, borderBottomWidth: 4 },
  input: { width: '80%', backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#A5D6A7', padding: 10, fontSize: 16, marginBottom: 20, textAlign: 'center' },
  button: { backgroundColor: '#2E7D32', padding: 14, borderRadius: 10, width: '70%' },
  buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
});

export default ScanQRCode;
