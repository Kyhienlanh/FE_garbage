import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import LottieView from 'lottie-react-native';

interface CustomLoadingProps {
  visible: boolean;
  message?: string;
  onRequestClose?: () => void; // callback khi chạm ra ngoài
}

const CustomLoading = ({ visible, message = 'Đang xử lý...', onRequestClose }: CustomLoadingProps) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onRequestClose} // Android back button
    >
      <Pressable style={styles.overlay} onPress={onRequestClose}>
        <View style={styles.container}>
          <LottieView
            source={require('../assets/SandyLoading.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
          <Text style={styles.text}>{message}</Text>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 160,
    height: 160,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 100,
    height: 100,
  },
  text: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default CustomLoading;
