import React, { useState } from "react";
import { PermissionsAndroid, Platform, Alert } from "react-native";
import { launchCamera, CameraOptions } from "react-native-image-picker";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ScanResult } from "../types/Detection";
import CustomLoading from './CustomLoading';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "ScanGarbage">;

const ScanGarbage = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(false);

  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Quyền truy cập camera",
            message: "Ứng dụng cần quyền camera để chụp ảnh rác.",
            buttonNeutral: "Hỏi lại sau",
            buttonNegative: "Hủy",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn("Lỗi request permission:", err);
        return false;
      }
    }
    return true;
  };

 const takePhotoAndDetect = async () => {
  const options: CameraOptions = {
    mediaType: "photo",
    includeBase64: true,
    saveToPhotos: false,
  };

  launchCamera(options, async (response) => {
    if (response.didCancel) return;
    if (response.errorCode) {
      Alert.alert("Lỗi camera", response.errorMessage || "Không thể mở camera");
      return;
    }

    if (response.assets && response.assets[0].base64) {
      const base64Image = response.assets[0].base64;

      // 🔹 Bắt đầu loading ngay trước khi gọi API
      setLoading(true);

      try {
        const res = await fetch("http://192.168.1.19:2000/detect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64Image }),
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();

        const scanResult: ScanResult = {
          photo: "data:image/jpeg;base64," + base64Image,
          processedPhoto: data.image_base64
            ? "data:image/jpeg;base64," + data.image_base64
            : "data:image/jpeg;base64," + base64Image,
          detections: data.detections || [],
        };

        // 🔹 Điều hướng sang ResultScreen
        navigation.navigate("ResultScreen", { scanResult });
      } catch (err) {
        console.error("❌ Lỗi khi gọi API:", err);
        Alert.alert("Lỗi mạng/API", "Không thể kết nối tới server. Vui lòng thử lại.");
      } finally {
        // 🔹 Tắt loading sau khi xong API
        setLoading(false);
      }
    }
  });
};

  useFocusEffect(
    React.useCallback(() => {
      const openCamera = async () => {
        const hasPermission = await requestCameraPermission();
        if (hasPermission) takePhotoAndDetect();
        else Alert.alert("Không có quyền camera", "Vui lòng cấp quyền camera để tiếp tục.");
      };
      openCamera();
    }, [])
  );

  // ✅ Hiển thị CustomLoading khi đang tải
  return <CustomLoading visible={loading} />;
};

export default ScanGarbage;
