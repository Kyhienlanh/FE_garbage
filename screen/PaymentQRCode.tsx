import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import auth from '@react-native-firebase/auth';

const PaymentQRCode = () => {
  const user = auth().currentUser;
  const points = 50;

  const [qrValue, setQrValue] = useState<string>('');
  const [secondsLeft, setSecondsLeft] = useState<number>(60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Tạo payload QR (client-side). Thực tế nên gọi backend để tạo token đã sign.
  const generatePayload = () => {
    const nonce = Math.random().toString(36).slice(2, 10); // chuỗi ngẫu nhiên ngắn
    const createdAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 60 * 1000).toISOString(); // hết hạn sau 60s

    return {
      uid: user?.uid ?? null,
      points,
      nonce,
      createdAt,
      expiresAt,
    };
  };

  const generateQr = () => {
    const payload = generatePayload();
    // Bạn có thể stringify hoặc mã hóa thêm (base64)
    setQrValue(JSON.stringify(payload));
    setSecondsLeft(60); // reset countdown
  };

  // Start interval để đếm ngược và tự regenerate khi = 0
  useEffect(() => {
    generateQr(); // tạo QR lần đầu khi mount

    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          // khi countdown về 0 thì tạo QR mới (và trả về 60)
          generateQr();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quét để thanh toán</Text>

      {qrValue ? (
        <QRCode value={qrValue} size={220} />
      ) : (
        <Text>Đang tạo QR...</Text>
      )}

      <Text style={styles.points}>Thanh toán {points} điểm</Text>

      <View style={styles.countdownRow}>
        <Text style={styles.countdown}>Hết hạn trong: {secondsLeft}s</Text>
        
      </View>
      {/* <View>
        <Button title="Tạo lại" onPress={generateQr} />
      </View> */}
      <Text style={styles.hint}>
        Lưu ý: QR sẽ tự đổi sau mỗi 60s. Hãy quét ngay khi bạn thấy mã này!
      </Text>
    </View>
  );
};

export default PaymentQRCode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: { fontSize: 20, marginBottom: 16, fontWeight: '600' },
  points: { marginTop: 14, fontSize: 16, color: 'green' },
  countdownRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  countdown: { fontSize: 14, marginRight: 12 },
  hint: { marginTop: 12, fontSize: 12, color: 'gray', textAlign: 'center' },
});
