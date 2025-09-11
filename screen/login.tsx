import { StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const navigation: any = useNavigation();
  const [isSelected, setSelection] = useState(false);

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#f8f8f8ff' }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header App Name */}
        <Text style={styles.header}>GreenE</Text>

        {/* Body Form */}
        <View style={styles.body}>
          <Text style={styles.welcome}>Chào mừng đến với</Text>
          <Text style={styles.appName}>GreenE</Text>

          {/* Email */}
          <Text style={styles.label}>Tài khoản</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Nhập tài khoản"
            placeholderTextColor="#aaa"
          />

          {/* Password */}
          <Text style={styles.label}>Mật khẩu</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Nhập mật khẩu"
            secureTextEntry={true}
            placeholderTextColor="#aaa"
          />

          {/* Remember + Forgot */}
          <View style={styles.rowBetween}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.checkbox}></View>
              <Text style={{ marginLeft: 6 }}>Ghi nhớ</Text>
            </View>
            <TouchableOpacity>
              <Text style={{ color: 'green' }}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>

          {/* Button Login */}
          <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('bottomNavigation')}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Đăng nhập</Text>
          </TouchableOpacity>

          {/* Or login with */}
          <Text style={{ textAlign: 'center', marginVertical: 15, color: '#555' }}>Hoặc đăng nhập với</Text>

          {/* Social buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn}>
              <Text>🌐</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Text>G</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Text></Text>
            </TouchableOpacity>
          </View>
           <TouchableOpacity  onPress={() => navigation.navigate('register')}>
            <Text style={{ color: 'green', fontSize: 16, fontWeight: 'bold', marginTop:150,textAlign:'center' }}>Tạo tài khoản?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Login

const styles = StyleSheet.create({
  header: {
    marginTop: 50,
    fontSize: 24,
    color: 'green',
    fontWeight: 'bold'
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
    textAlign: 'center'
  },
  welcome: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
    fontWeight:'bold'
  },
  appName: {
    fontSize: 22,
    color: 'green',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  label: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginTop: 5,
    marginBottom: 10
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4
  },
  loginBtn: {
    backgroundColor: 'green',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10
  },
  socialBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10
  }
})
