import { StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView,Alert } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import user from './user';
import Config from '../config/config';
const register = () => {
  const navigation: any = useNavigation();
  const [isSelected, setSelection] = useState(false);
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [rePassword, setrePassword] = useState('');
  const [loading, setLoading] = useState(false);
  const postUid=async(username:string ,password:string,uid:string)=>{
    try{
      // const response = await fetch(`${Config.BASE_URL}/Users`);
      const response= await fetch(`${Config.API_BASE_URL}/api/Users`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          // 'Authorization':'Bearer token',
        },
        body:JSON.stringify({
          "fullName": username,
          "email": username,
          "passwordHash": password, 
          "points": 0,
          "userIDfireBase": uid
        }),
      });
      const json = await response.json();
      Alert.alert("Thông báo", JSON.stringify(json));

    }catch{
      Alert.alert("loi call api");
    }
  }

  const HandleRegister= async() => {
    if(Username.length==0 || Password.length==0 || rePassword.length==0){
      Alert.alert('Vui lòng nhập đầy đủ thông tin')
      return;
    }
    if(Password!=rePassword){   
      Alert.alert('Mật khẩu không khớp')
      return;
    } 
    try{
      const userCredential =await auth().createUserWithEmailAndPassword(Username.trim(), Password);
      const userID = userCredential.user.uid;
      if(!userID){
        Alert.alert("không có userID");
      }else{
        postUid(Username,Password,userID);
        Alert.alert('Đăng ký thành công tài khoản '+userID);
      }

    }catch(e){
      console.log(e);
       Alert.alert('Đăng ký thất bại', (e as any).message);
    }finally{
      setLoading(false);
    }
  }
  
  const getUsers = async () => {
  try {
    const response = await fetch("http://192.168.1.34:5000/api/Users", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Danh sách user:", data);
    return data;
  } catch (error) {
    console.error("Lỗi khi fetch Users:", error);
    return null;
  }
};
  const test=()=>{
    const link=Config.API_BASE_URL;
    Alert.alert(link+"/Users");
  }


  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#f8f8f8ff' }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header App Name */}
        <View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={{fontSize:30}}>  </Text>
            </TouchableOpacity>
            <Text style={styles.header}>GreenE</Text>
        </View>

        {/* Body Form */}
        <View style={styles.body}>
          <Text style={styles.welcome}>Tạo tài khoản?</Text>
         

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Nhập Email"
            onChangeText={(text) => setUsername(text)}
            placeholderTextColor="#aaa"
          />
          {/* Password */}
          <Text style={styles.label}>Mật khẩu</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Nhập mật khẩu"
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
            placeholderTextColor="#aaa"
          />
            {/* Password */}
          <Text style={styles.label}>Mật khẩu</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Nhập mật khẩu"
            onChangeText={(text) => setrePassword(text)}
            secureTextEntry={true}
            placeholderTextColor="#aaa"
          />

         
          {/* Button Login */}
          <TouchableOpacity style={styles.loginBtn} onPress={() => HandleRegister()}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Tạo tài khoản</Text>
          </TouchableOpacity>
            <TouchableOpacity style={styles.loginBtn} onPress={() => test()}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>test</Text>
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default register

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
  },

})
