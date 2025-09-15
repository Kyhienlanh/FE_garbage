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
import { useNavigation ,NavigationProp} from '@react-navigation/native';
const PhoneAuth = () => {
   const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [confirmResult, setConfirmResult] =useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  // Hàm chuẩn hóa số điện thoại về dạng quốc tế
  const formatPhoneNumber = (number: string) => {
    if (number.startsWith('0')) {
      return '+84' + number.substring(1);
    }
    return number; // nếu đã có +84 thì giữ nguyên
  };

  // Gửi OTP
  const signInWithPhoneNumber = async () => {
    try {
      const formatted = formatPhoneNumber(phone);
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

  // Xác minh OTP
  const confirmCode = async () => {
    try {
      if (!confirmResult) {
        Alert.alert('Chưa gửi OTP', 'Bạn cần nhập số điện thoại trước');
        return;
      }
      console.log('🔑 Đang xác minh OTP:', code);

      const result = await confirmResult.confirm(code);
      setUser(result?.user || null);

      Alert.alert('Đăng nhập thành công', result?.user?.phoneNumber || '');
      navigation.navigate('bottomNavigation');
      console.log('🎉 Đăng nhập thành công:', result?.user);
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
        <TouchableOpacity
          style={styles.button}
          onPress={signInWithPhoneNumber}
        >
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
  success: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
});
