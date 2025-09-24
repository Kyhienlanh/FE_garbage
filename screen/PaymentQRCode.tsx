import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import auth from '@react-native-firebase/auth';
import Svg, { Circle } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';
import { NavigationProp, useNavigation } from '@react-navigation/native';

const QR_SIZE = 200; // QR code size
const CIRCLE_SIZE = QR_SIZE + 120; // vòng tròn lớn hơn QR
const STROKE_WIDTH = 6;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const PaymentQRCode = () => {
  const navigation :NavigationProp<RootStackParamList> = useNavigation();
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  const user = auth().currentUser;

  const [qrValue, setQrValue] = useState<string>('');
  const [secondsLeft, setSecondsLeft] = useState<number>(60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const pulseAnim = useRef(new Animated.Value(0)).current;
  const circleAnim = useRef(new Animated.Value(60)).current;

  // Tạo payload QR
  const generatePayload = () => {
    const nonce = Math.random().toString(36).slice(2, 10);
    const createdAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 60 * 1000).toISOString();
    return { uid: user?.uid ?? null, nonce, createdAt, expiresAt };
  };

  const generateQr = () => {
    setQrValue(JSON.stringify(generatePayload()));
    setSecondsLeft(60);
    circleAnim.setValue(60);
  };

  // Countdown interval
  useEffect(() => {
  generateQr();

  intervalRef.current = setInterval(() => {
    setSecondsLeft(prev => {
      if (prev <= 1) {
        generateQr();
        return 60;
      }
      circleAnim.setValue(prev - 1);
      return prev - 1;
    });
  }, 1000);

  // Cleanup function trả về void
  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
}, []);


  // Pulse animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Circular progress
  const strokeDashoffset = circleAnim.interpolate({
    inputRange: [0, 60],
    outputRange: [0, CIRCUMFERENCE],
  });

  return (
    <View style={styles.container}>
      {/* Header icon */}
       <View style={styles.topBar}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                <Icon name="arrow-back" size={28} color="white" />
              </TouchableOpacity>
             
        </View>
      <Image source={require('../images/garbage_icon.jpg')} style={styles.icon} />
      <Text style={styles.title}>Quét mã để thu gom rác</Text>
      <Text style={styles.subtitle}>Mã QR sẽ thay đổi sau mỗi 60 giây</Text>

      {/* QR + countdown wrapper */}
      <View style={styles.qrWrapper}>
        {/* Vòng tròn countdown */}
        <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} style={{ position: 'absolute', zIndex: 2 }}>
          <Circle
            stroke="#E0E0E0"
            fill="transparent"
            strokeWidth={STROKE_WIDTH}
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
          />
          <AnimatedCircle
            stroke="#2E7D32"
            fill="transparent"
            strokeWidth={STROKE_WIDTH}
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            originX={CIRCLE_SIZE / 2}
            originY={CIRCLE_SIZE / 2}
          />
        </Svg>

        {/* Pulse animation */}
        {/* <Animated.View
          style={[
            {
              position: 'absolute',
              width: CIRCLE_SIZE - 10,
              height: CIRCLE_SIZE - 10,
              borderRadius: (CIRCLE_SIZE - 10) / 2,
              backgroundColor: '#A5D6A7',
              zIndex: 1,
            },
            {
              transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] }) }],
              opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 0.3] }),
            },
          ]}
        /> */}

        {/* QR Code */}
        {qrValue ? (
          <QRCode value={qrValue} size={QR_SIZE} color="#2E7D32" backgroundColor="#E8F5E9" />
        ) : (
          <Text>Đang tạo QR...</Text>
        )}
      </View>

      {/* Countdown text */}
      <Text style={styles.countdown}>Hết hạn sau: {secondsLeft}s</Text>
      <Text style={styles.hint}>Hãy quét ngay khi bạn thấy QR này!</Text>
    </View>
  );
};

export default PaymentQRCode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F5F1',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: { width: 60, height: 60, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', color: '#2E7D32', marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#4E944F', marginBottom: 20, textAlign: 'center' },
  qrWrapper: { width: CIRCLE_SIZE, height: CIRCLE_SIZE, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  countdown: { fontSize: 16, color: '#2E7D32', marginBottom: 6 },
  hint: { fontSize: 12, color: '#4E944F', textAlign: 'center' },
   iconButton: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30,
  }, 
  topBar: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
});
