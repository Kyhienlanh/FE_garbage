import { 
  StyleSheet, Text, View, TouchableOpacity, TextInput, 
  KeyboardAvoidingView, Platform, ScrollView, Alert 
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Config from '../config/config';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Register = () => {
  const navigation: any = useNavigation();
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '946669341689-jc6sjrca4qaao4m75umaa73lk4hc30l4.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);
  // Gửi thông tin user về API
  const postUid = async (username: string, password: string, uid: string) => {
    try {
      const response = await fetch(`${Config.API_BASE_URL}/api/Users`, {
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

      const json = await response.json();
      Alert.alert("Thông báo", JSON.stringify(json));
    } catch {
      Alert.alert("Lỗi call API");
    }
  };

  // Đăng ký email + password
  const HandleRegister = async () => {
    if (Username.length === 0 || Password.length === 0 || rePassword.length === 0) {
      Alert.alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (Password !== rePassword) {
      Alert.alert('Mật khẩu không khớp');
      return;
    }
    try {
      setLoading(true);
      const userCredential = await auth().createUserWithEmailAndPassword(Username.trim(), Password);
      const userID = userCredential.user.uid;

      if (!userID) {
        Alert.alert("Không có userID");
      } else {
        await postUid(Username, Password, userID);
        Alert.alert('Đăng ký thành công', `Tài khoản: ${userID}`);
      }
    } catch (e: any) {
      console.log("❌ Lỗi đăng ký:", e);
      Alert.alert('Đăng ký thất bại', e.message);
    } finally {
      setLoading(false);
    }
  };

  // Đăng nhập Google
  const signInWithGoogle = async () => {
    try {
      console.log("Bắt đầu Google Sign-In");

      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      const { idToken } = await GoogleSignin.signIn() as any;
      if (!idToken) {
        Alert.alert("Đăng nhập thất bại", "Không tìm thấy ID token");
        return;
      }

      // Tạo Firebase credential
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Đăng nhập Firebase
      const userCredential = await auth().signInWithCredential(googleCredential);

      console.log("✅ Đăng nhập Firebase thành công:", userCredential.user);
      Alert.alert("Đăng nhập thành công", `Xin chào ${userCredential.user.displayName || 'user'}`);
    } catch (error: any) {
      console.log("❌ Lỗi Google Sign-In:", error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("Đăng nhập bị hủy", "Người dùng đã hủy đăng nhập");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert("Đang đăng nhập", "Quá trình đăng nhập đang diễn ra");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Lỗi Google Play Services", "Google Play Services không khả dụng hoặc cần update");
      } else {
        Alert.alert("Đăng nhập thất bại", error.message || "Lỗi không xác định");
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#f8f8f8ff' }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 30 }}>  </Text>
          </TouchableOpacity>
          <Text style={styles.header}>GreenE</Text>
        </View>

        {/* Body Form */}
        <View style={styles.body}>
          <Text style={styles.welcome}>Tạo tài khoản?</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Nhập Email"
            onChangeText={setUsername}
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Mật khẩu</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Nhập mật khẩu"
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Nhập lại mật khẩu</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Nhập lại mật khẩu"
            onChangeText={setRePassword}
            secureTextEntry
            placeholderTextColor="#aaa"
          />

          <TouchableOpacity style={styles.loginBtn} onPress={HandleRegister}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Tạo tài khoản</Text>
          </TouchableOpacity>

          <Text style={{ textAlign: 'center', marginVertical: 15, color: '#555' }}>Hoặc đăng nhập với</Text>

          {/* Social buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn}>
              <Text>🌐</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} onPress={signInWithGoogle}>
              <Text>G</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} onPress={() => navigation.navigate('PhoneAuth')}>
              <Ionicons name="call-outline" size={24} color="#06be34ff" />
            </TouchableOpacity>
           
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  header: {
    marginTop: 50,
    fontSize: 24,
    color: 'green',
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  welcome: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
  label: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginTop: 5,
    marginBottom: 10,
  },
  loginBtn: {
    backgroundColor: 'green',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  socialBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
});
