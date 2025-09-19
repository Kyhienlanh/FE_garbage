import { StyleSheet, Text, TouchableOpacity, View ,ScrollView,Image, Platform, Linking} from 'react-native'
import React from 'react'
import config from '../config/config';
import { PointsGarbage } from '../types/pointsGarbage';
import { useFocusEffect } from '@react-navigation/native';



const pointsGarbage = () => {
    const [inforgarBage,SetInforgarBage]=React.useState<PointsGarbage[]>([]);
    const getpointsGarbage = async() =>{
        try{
            const response = await fetch(`${config.API_BASE_URL}/pointsGarbages`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const json = await response.json();
            SetInforgarBage(json);
           
        }
        catch(error){
            console.log('❌ getpointsGarbage lỗi:', error);
        }
    }
    useFocusEffect(
        React.useCallback(() => {
            getpointsGarbage();
        }, [])
    );

    const openMap = (latitude: number, longitude: number, label?: string) => {
    const latLng = `${latitude},${longitude}`;
    const query = label ? encodeURIComponent(label) : "";
    const url =
        Platform.OS === "ios"
        ? `maps:0,0?q=${query}@${latLng}`
        : `geo:0,0?q=${latLng}(${query})`;

    Linking.openURL(url);
    };
  return (
    <ScrollView  style={styles.container}>
        <View>
        <Text>Mời bạn mang rác tái chế đến để đổi lấy điểm thưởng</Text>
        <Text>Danh sách địa điểm thu gom rác</Text>
         <TouchableOpacity onPress={getpointsGarbage}>
        <Text>Get Points Garbage</Text>
        </TouchableOpacity>
        {inforgarBage.map(item=>(
            <TouchableOpacity key={item.id}   onPress={() => openMap(item.latitude, item.longitude, item.name)} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',margin:10,padding:10,borderWidth:1,borderColor:'#ccc',borderRadius:8}}>
                <View>
                    <Image source={{uri:item.img}} style={{width:100,height:100}}/>
                </View>
                <View>
                     <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
                    <Text>Địa chỉ: {item.address}</Text>
                    <Text>Số điện thoại: {item.phone}</Text>
                    <Text>Giờ mở cửa: {item.opentime}</Text>             
                </View>
            </TouchableOpacity>
        ))
        }
    </View>
    </ScrollView>
   
  )
}

export default pointsGarbage

const styles = StyleSheet.create({
    container:{
    flex:1,
    backgroundColor:'#fff',
    }
})