import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Image, Platform, Linking } from 'react-native';
import React from 'react';
import config from '../config/config';
import { PointsGarbage } from '../types/pointsGarbage';
import { useFocusEffect } from '@react-navigation/native';

const PointsGarbageScreen = () => {
  const [inforgarBage, SetInforgarBage] = React.useState<PointsGarbage[]>([]);

  const getpointsGarbage = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/pointsGarbages`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const json = await response.json();
      SetInforgarBage(json);
    } catch (error) {
      console.log('❌ getpointsGarbage lỗi:', error);
    }
  };

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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>♻️ Điểm Thu Gom Rác</Text>
        <Text style={styles.subtitle}>Mang rác tái chế đến để nhận điểm thưởng!</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={getpointsGarbage}>
          <Text style={styles.refreshText}>Cập nhật danh sách</Text>
        </TouchableOpacity>
      </View>

      {inforgarBage.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => openMap(item.latitude, item.longitude, item.name)}
          style={styles.card}
        >
          <Image source={{ uri: item.img }} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardText}>📍 {item.address}</Text>
            <Text style={styles.cardText}>📞 {item.phone}</Text>
            <Text style={styles.cardText}>🕒 {item.opentime}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default PointsGarbageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f2e6', // màu xanh nhạt, cảm giác thiên nhiên
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2e7d32', // xanh lá đậm
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#4caf50',
    textAlign: 'center',
    marginVertical: 8,
  },
  refreshButton: {
    backgroundColor: '#81c784',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 10,
  },
  refreshText: {
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4, // cho Android shadow
    alignItems: 'center',
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
});
