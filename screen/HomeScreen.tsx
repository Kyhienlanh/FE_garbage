import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import config from '../config/config';
import { User } from '../types/User';
import { NavigationProp, useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
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
  const PaymentQRcode =()=>{
    navigation.navigate('PaymentQRCode');
  }
  const ScanQRCode =()=>{
    navigation.navigate('ScanQRCode');
  }
  const CollectPoints =()=>{
    navigation.navigate('ScanQRCode');
  }
  const NearbyOffers =()=>{
    navigation.navigate('ScanQRCode');
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

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.userName}>{infor?.fullName}</Text>

            <View style={styles.icons}>
              <Ionicons name="search-outline" size={22} color="white" style={styles.icon} />
              <Ionicons name="notifications-outline" size={22} color="white" style={styles.icon} />
              <Ionicons name="cart-outline" size={22} color="white" style={styles.icon} />
            </View>
          </View>
          <Text style={styles.point}>{infor?.points} điểm</Text>
          {/* <Text onPress={()=>getUser(user?.uid)}>test</Text> */}
        </View>
        {/* Menu 4 nút tròn */}
        <View style={styles.circleMenu}>
          {[
            { icon: "qr-code-outline", label: "Nhận mã nạp điểm", onPress: ScanQRCode },
            { icon: "star-outline", label: "Tích điểm MPoint", onPress: CollectPoints },
            { icon: "card-outline", label: "Thanh toán điểm", onPress: PaymentQRcode },
            { icon: "gift-outline", label: "Ưu đãi quanh đây", onPress: NearbyOffers }
          ].map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.circleItem} 
              onPress={item.onPress} // dùng hàm riêng cho từng item
            >
              <Ionicons name={item.icon} size={28} color="green" />
              <Text style={styles.circleText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>


        {/* Menu 3 ô vuông */}
        <View style={styles.squareMenu}>
          <TouchableOpacity style={[styles.squareItem, { backgroundColor: '#f58220' }]} onPress={()=>navigation.navigate('pointsGarbage')}>
            <Ionicons name="gift-outline" size={24} color="white" />
            <Text style={styles.squareText}>Đổi rác lấy quà</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.squareItem, { backgroundColor: '#007bff' }]} onPress={()=>navigation.navigate('ScheduleGarbage')}>
            <Ionicons name="calendar-outline" size={24} color="white" />
            <Text style={styles.squareText}>Đặt lịch thu gom</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.squareItem, { backgroundColor: '#ffc107' }]}>
            <Ionicons name="scan-outline" size={24} color="white" />
            <Text style={styles.squareText}>Quét mã thùng rác</Text>
          </TouchableOpacity>
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <Image
            source={{ uri: 'https://via.placeholder.com/400x200' }}
            style={{ width: '100%', height: 150, borderRadius: 10 }}
            resizeMode="cover"
          />
        </View>

        {/* Thanh menu cuối */}
        <View style={styles.bottomMenu}>
          <TouchableOpacity style={[styles.bottomItem, { backgroundColor: '#00b894' }]}>
            <Text style={styles.bottomText}>Hướng dẫn</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.bottomItem, { backgroundColor: '#fdcb6e' }]}>
            <Text style={styles.bottomText}>Học và chơi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.bottomItem, { backgroundColor: '#fab1a0' }]}>
            <Text style={styles.bottomText}>Mời hàng xóm</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: 'green',
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userName: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  icons: { flexDirection: 'row' },
  icon: { marginLeft: 12 },
  point: { color: 'white', fontSize: 16, marginTop: 5 },

  circleMenu: { flexDirection: 'row', justifyContent: 'space-around', padding: 16, backgroundColor: '#e9f7ef' },
  circleItem: { alignItems: 'center', width: 80 },
  circleText: { fontSize: 12, textAlign: 'center', marginTop: 6, color: '#333' },

  squareMenu: { flexDirection: 'row', justifyContent: 'space-around', padding: 12 },
  squareItem: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center'
  },
  squareText: { color: 'white', fontSize: 12, marginTop: 6, textAlign: 'center' },

  banner: { margin: 16 },

  bottomMenu: { flexDirection: 'row', justifyContent: 'space-around', padding: 12 },
  bottomItem: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  bottomText: { color: 'white', fontWeight: 'bold' }
});
