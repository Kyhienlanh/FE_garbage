import Icon from 'react-native-vector-icons/Ionicons'
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import config from '../config/config';
import { User } from '../types/User';
import { NavigationProp, useNavigation } from '@react-navigation/native';

const Setting = () => {
    const user = auth().currentUser;
    const navigation: NavigationProp<RootStackParamList> = useNavigation();
    const [infor,SetInfor]=useState<User>();
    const getUser= async(uid:any) => {
    try{
        const response = await fetch(`${config.API_BASE_URL}/Users/firebase/${uid}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        const json = await response.json();
        SetInfor(json);
        console.log('✅ getUser json:', infor?.points);
    }catch(error){
      console.log('❌ getUser lỗi:', error);
    }
  }
  useEffect(() => {
    if(user==null){
        navigation.navigate('login');
        return;
    }
    else{
      getUser(user?.uid);
    }
  }
  , []);
  const handleLogout = async() => {
    try{
       auth().signOut();
       navigation.navigate('login');
    }catch(error){
        console.log('❌ logout lỗi:', error);
    }
  }
  return (
    <ScrollView style={styles.container}>
      {/* Header Profile */}
      <View style={styles.profileSection}>
        <Image 
          source={{ uri: 'https://i.pravatar.cc/100' }} 
          style={styles.avatar} 
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{infor?.fullName}</Text>
          <Text style={styles.joined}>Tham gia từ <Text>
                    {infor?.createdAt 
                    ? new Date(infor.createdAt).toLocaleDateString('vi-VN') 
                    : ''}
                </Text> 
        </Text>
        </View>
        <TouchableOpacity>
          <Icon name="create-outline" size={22} color="green" />
        </TouchableOpacity>
      </View>

      {/* Reward Card */}
      <View style={styles.rewardCard}>
        <View>
          <Text style={styles.rewardTitle}>Điểm thưởng</Text>
          <Text style={styles.rewardSubtitle}> </Text>
        </View>
        <Text style={styles.rewardValue}>{infor?.points}</Text>
      </View>

      {/* Menu Items */}
      <TouchableOpacity style={styles.menuItem}>
        <Icon name="ticket-outline" size={20} color="green" />
        <Text style={styles.menuText}>Phiếu giảm giá</Text>
        {/* <View style={styles.badge}>
          <Text style={styles.badgeText}>1</Text>
        </View> */}
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <Icon name="call-outline" size={20} color="green" />
        <Text style={styles.menuText}>Nhận trợ giúp
</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <Icon name="help-circle-outline" size={20} color="green" />
        <Text style={styles.menuText}>Hỏi đáp</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <Icon name="book-outline" size={20} color="green" />
        <Text style={styles.menuText}>Nguyên tắc cộng đồng</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <Icon name="settings-outline" size={20} color="green" />
        <Text style={styles.menuText}>Cài đặt</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Icon name="log-out-outline" size={20} color="green" />
        <Text style={styles.logoutText}>Thoát</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default Setting

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  joined: {
    fontSize: 12,
    color: 'gray'
  },
  rewardCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#4CAF50', // xanh lá
    margin: 15,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center'
  },
  rewardTitle: {
    color: '#fff',
    fontWeight: 'bold'
  },
  rewardSubtitle: {
    color: '#f0f0f0',
    fontSize: 12
  },
  rewardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff'
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee'
  },
  menuText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16
  },
  badge: {
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  badgeText: {
    color: '#fff',
    fontSize: 12
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    padding: 15,
    borderTopWidth: 0.5,
    borderTopColor: '#eee'
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold'
  }
})
