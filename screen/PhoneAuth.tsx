import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import config from '../config/config';
import CustomLoading from './CustomLoading';

const PhoneAuth = () => {
  const navigation = useNavigation<any>();

  // State cơ bản
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [confirmResult, setConfirmResult] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(false);

  // Timer OTP
  const [timer, setTimer] = useState<number>(0);

  // Resend OTP
  const [resendDisabled, setResendDisabled] = useState<boolean>(true);
  const [resendTimer, setResendTimer] = useState<number>(30);

  // ✅ Countdown OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (confirmResult && timer > 0 && !user) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0 && confirmResult) {
      Alert.alert('Hết thời gian', 'Vui lòng nhập lại số điện thoại');
      setConfirmResult(null);
      setCode('');
    }
    return () => clearInterval(interval);
  }, [confirmResult, timer, user]);

  // ✅ Countdown resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendDisabled) {
      interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendDisabled]);

  // ✅ Validate số điện thoại VN
  const formatPhoneNumber = (number: string): string | null => {
    const regex = /^(0|\+84)\d{9}$/;
    if (!regex.test(number)) {
      Alert.alert('Số điện thoại không hợp lệ', 'Vui lòng nhập đúng định dạng');
      return null;
    }
    if (number.startsWith('0')) {
      return '+84' + number.substring(1);
    }
    return number;
  };

  // ✅ Gửi UID lên server
  const postUid = async (username: string, password: string, uid: string) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/Users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: username,
          email: username,
          passwordHash: password,
          points: 0,
          userIDfireBase: uid,
        }),
      });

      if (!response.ok) throw new Error(`Lỗi API: ${response.status}`);
      const json = await response.json();
      Alert.alert('Thông báo', 'User đã được tạo: ' + JSON.stringify(json));
    } catch (error: any) {
      console.log('❌ postUid lỗi:', error);
      Alert.alert('Lỗi call API', error?.message || 'Không xác định');
    }
  };

  // ✅ Gửi OTP
  const sendOTP = async () => {
    try {
      const formatted = formatPhoneNumber(phone);
      if (!formatted) return;

      setLoading(true);
      const confirmation = await auth().signInWithPhoneNumber(formatted);
      setConfirmResult(confirmation);
      setTimer(300); // 5 phút
      setCode('');
      setResendDisabled(true);
      setResendTimer(30);
      Alert.alert('OTP đã gửi về số điện thoại của bạn');
    } catch (error: any) {
      Alert.alert('Lỗi gửi OTP', error?.message || 'Không xác định');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Xác minh OTP
  const confirmCode = async () => {
    try {
      if (!confirmResult) {
        Alert.alert('Chưa gửi OTP', 'Bạn cần nhập số điện thoại trước');
        return;
      }

      setLoading(true);
      const result = await confirmResult.confirm(code);
      if (!result?.user) {
        Alert.alert('Xác minh thất bại', 'Không tìm thấy user');
        return;
      }
      setUser(result.user);

      // Kiểm tra user trên server
      try {
        const checkResponse = await fetch(
          `${config.API_BASE_URL}/Users/firebase/${result.user.uid}`
        );
        if (checkResponse.status === 404) {
          await postUid(result.user.phoneNumber || 'unknown', 'defaultPassword', result.user.uid);
        } else if (!checkResponse.ok) {
          throw new Error(`API check user lỗi: ${checkResponse.status}`);
        }
      } catch (err: any) {
        Alert.alert('Lỗi API', err?.message || 'Không xác định');
      }

      Alert.alert('Đăng nhập thành công', result.user.phoneNumber || '');
      navigation.navigate('bottomNavigation');
    } catch (error: any) {
      Alert.alert('Lỗi xác thực', error?.message || 'OTP không hợp lệ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../images/garbage_icon.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>🌿 Protect Environment</Text>

        {!confirmResult ? (
          <>
            <TextInput
              placeholder="Nhập số điện thoại"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.input}
              placeholderTextColor="#eee"
            />
            <TouchableOpacity style={styles.button} onPress={sendOTP} disabled={loading}>
              <Text style={styles.buttonText}>Gửi OTP</Text>
            </TouchableOpacity>
            <Text style={styles.note}>
              Bằng việc tiếp tục, bạn đồng ý với chính sách bảo mật
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.subtitle}>Nhập mã OTP</Text>

            <TextInput
              placeholder="- - - - - -"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              style={styles.inputOtp}
              maxLength={6}
              placeholderTextColor="#eee"
            />
            <TouchableOpacity style={styles.button} onPress={confirmCode} disabled={loading}>
              <Text style={styles.buttonText}>Xác minh</Text>
            </TouchableOpacity>
            <Text style={styles.timer}>
              Thời gian còn lại: {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}
            </Text>
            <TouchableOpacity
              onPress={sendOTP}
              disabled={resendDisabled || loading}
            >
              <Text style={[styles.resend, (resendDisabled || loading) && { color: '#aaa' }]}>
                {resendDisabled ? `Gửi lại OTP sau ${resendTimer}s` : 'Gửi lại OTP'}
              </Text>
            </TouchableOpacity>
          </>
        )}
        <CustomLoading visible={loading} />
      </View>
    </ImageBackground>
  );
};

export default PhoneAuth;

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: 'rgba(0,128,0,0.3)' },
  title: { fontSize: 26, fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 40 },
  subtitle: { fontSize: 20, fontWeight: '600', color: '#fff', textAlign: 'center', marginBottom: 10 },
  timer: { color: '#fff', textAlign: 'center', marginBottom: 10, fontSize: 16, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#A5D6A7', borderRadius: 8, padding: 14, fontSize: 16, marginBottom: 20, backgroundColor: 'rgba(255,255,255,0.3)', color: '#fff' },
  inputOtp: { borderWidth: 1, borderColor: '#A5D6A7', borderRadius: 8, padding: 14, fontSize: 24, letterSpacing: 12, textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.3)', color: '#fff', marginBottom: 20 },
  button: { backgroundColor: '#4CAF50', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  note: { fontSize: 12, color: '#eee', textAlign: 'center', marginTop: 10 },
  resend: { color: '#fff', textAlign: 'center', marginTop: 10, fontWeight: '600' },
});
