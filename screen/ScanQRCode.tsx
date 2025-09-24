import { Alert, StyleSheet, Text, View, Animated, Easing, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useCameraPermission, Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const ScanQRCode = ({ navigation }: any) => {
  const { requestPermission } = useCameraPermission();
  const flashAnim = useRef(new Animated.Value(0)).current;
  const lineAnim = useRef(new Animated.Value(0)).current;
  const [scannerActive, setScannerActive] = useState(true);
  const [torchOn, setTorchOn] = useState(false);

  useEffect(() => {
    const handlePermissions = async () => {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert('Không có quyền truy cập camera.');
      }
    };
    handlePermissions();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(lineAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(lineAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const device = useCameraDevice('back');

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      if (!scannerActive) return;
      const scannedValue = codes[0]?.value;

      if (scannedValue) {
        try {
          const data = JSON.parse(scannedValue);
          Alert.alert(`UID: ${data.uid}\nPoints: ${data.points}`);
        } catch (error) {
          Alert.alert('Mã QR không hợp lệ');
        }
      } else {
        Alert.alert('QR Code trống');
      }
      setScannerActive(false);

      Animated.sequence([
        Animated.timing(flashAnim, { toValue: 0.5, duration: 100, useNativeDriver: true }),
        Animated.timing(flashAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();

      setTimeout(() => setScannerActive(true), 2000);
    },
  });

  if (!device) {
    return (
      <View style={styles.center}>
        <Text>Camera Not Found</Text>
      </View>
    );
  }

  const translateY = lineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 250],
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        torch={torchOn ? 'on' : 'off'}
        codeScanner={scannerActive ? codeScanner : undefined}
      />

      {/* Nút Back & Flash */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Icon name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTorchOn(!torchOn)} style={styles.iconButton}>
          <Icon name={torchOn ? 'flashlight' : 'flashlight-outline'} size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Overlay hướng dẫn */}
      <View style={styles.overlay}>
        <Text style={styles.title}>Quét mã QR</Text>
        <Text style={styles.subtitle}>Đặt mã QR vào trong khung để quét</Text>

        <View style={styles.scanBox}>
          {/* Đường quét */}
          <Animated.View
            style={[
              styles.scanLine,
              { transform: [{ translateY }] },
            ]}
          />
          {/* 4 góc phát sáng */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>

      {/* Hiệu ứng flash */}
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: 'white', opacity: flashAnim },
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topBar: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  iconButton: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
  },
  scanBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'rgba(0,255,0,0.3)',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  scanLine: {
    width: '100%',
    height: 2,
    backgroundColor: 'red',
    position: 'absolute',
    top: 0,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#00FF00',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderLeftWidth: 4,
    borderTopWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderRightWidth: 4,
    borderTopWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderRightWidth: 4,
    borderBottomWidth: 4,
  },
});

export default ScanQRCode;
