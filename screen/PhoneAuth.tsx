import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import config from '../config/config';

const PhoneAuth = () => {
  const navigation = useNavigation<any>();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [confirmResult, setConfirmResult] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  // ✅ Validate số điện thoại VN (0xxxxxxxxx hoặc +84xxxxxxxxx)
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: username,
          email: username,
          passwordHash: password,
          points: 0,
          userIDfireBase: uid,
        }),
      });

      if (!response.ok) {
        throw new Error(`Lỗi API: ${response.status}`);
      }

      const json = await response.json();
      Alert.alert('Thông báo', 'User đã được tạo: ' + JSON.stringify(json));
    } catch (error: any) {
      console.log('❌ postUid lỗi:', error);
      Alert.alert('Lỗi call API', error?.message || 'Không xác định');
    }
  };

  // ✅ Gửi OTP
  const signInWithPhoneNumber = async () => {
    try {
      const formatted = formatPhoneNumber(phone);
      if (!formatted) return;

      console.log('📩 Đang gửi OTP tới:', formatted);
      const confirmation = await auth().signInWithPhoneNumber(formatted);
      setConfirmResult(confirmation);

      Alert.alert('Thành công', 'OTP đã gửi về số điện thoại của bạn');
      console.log('✅ OTP đã gửi thành công!');
    } catch (error: any) {
      console.log('❌ Lỗi khi gửi OTP:', error);
      Alert.alert('Lỗi gửi OTP', error?.message || 'Không xác định');
    }
  };

  // ✅ Xác minh OTP
  const confirmCode = async () => {
    try {
      if (!confirmResult) {
        Alert.alert('Chưa gửi OTP', 'Bạn cần nhập số điện thoại trước');
        return;
      }
      console.log('🔑 Đang xác minh OTP:', code);

      const result = await confirmResult.confirm(code);

      if (!result?.user) {
        Alert.alert('Xác minh thất bại', 'Không tìm thấy user');
        return;
      }

      setUser(result.user);

      // Gọi API check user
      try {
        const checkResponse = await fetch(
          `${config.API_BASE_URL}/Users/firebase/${result.user.uid}`
        );

        if (checkResponse.status === 404) {
          // chưa có user -> tạo mới
          await postUid(
            result.user.phoneNumber || 'unknown',
            'defaultPassword',
            result.user.uid
          );
        } else if (!checkResponse.ok) {
          throw new Error(`API check user lỗi: ${checkResponse.status}`);
        } else {
          console.log('✅ User đã tồn tại, không cần tạo lại');
        }
      } catch (err: any) {
        console.log('❌ Lỗi khi check user:', err);
        Alert.alert('Lỗi API', err?.message || 'Không xác định');
      }

      Alert.alert('Đăng nhập thành công', result.user.phoneNumber || '');
      navigation.navigate('bottomNavigation');
      console.log('🎉 Đăng nhập thành công:', result.user);
    } catch (error: any) {
      console.log('❌ Mã OTP không hợp lệ:', error);
      Alert.alert('Lỗi xác thực', error?.message || 'OTP không hợp lệ');
    }
  };

  return (
    <View style={styles.container}>
      {!confirmResult ? (
        <>
          <TextInput
            placeholder="Nhập số điện thoại (VD: 0912345678)"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={signInWithPhoneNumber}>
            <Text style={styles.buttonText}>Gửi OTP</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            placeholder="Nhập mã OTP"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={confirmCode}>
            <Text style={styles.buttonText}>Xác minh</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default PhoneAuth;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    marginBottom: 10,
    padding: 10,
    borderRadius: 6,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
