  import React, { useEffect } from "react";
  import { PermissionsAndroid, Platform } from "react-native";
  import { launchCamera } from "react-native-image-picker";
  import { NativeStackNavigationProp } from "@react-navigation/native-stack";
  import { useFocusEffect, useNavigation } from "@react-navigation/native";
  import { ScanResult } from "../types/Detection"; // 👈 import interface

  type NavigationProp = NativeStackNavigationProp<RootStackParamList, "ScanGarbage">;

  const ScanGarbage = () => {
    const navigation = useNavigation<NavigationProp>();

    const requestCameraPermission = async () => {
      if (Platform.OS === "android") {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: "Quyền truy cập camera",
              message: "Ứng dụng cần dùng camera để chụp ảnh rác.",
              buttonNeutral: "Hỏi lại sau",
              buttonNegative: "Hủy",
              buttonPositive: "OK",
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
          console.warn(err);
          return false;
        }
      }
      return true;
    };

    const takePhotoAndDetect = async () => {
      launchCamera({ mediaType: "photo", includeBase64: true }, async (response) => {
        if (response.didCancel) {
          console.log("🚫 Người dùng hủy chụp ảnh");
          return;
        }
        if (response.assets && response.assets[0].base64) {
          const base64Image = response.assets[0].base64;

          try {
            const res = await fetch("http://10.29.177.74:5000/detect", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ image: base64Image }),
            });

            const data = await res.json();
            console.log("✅ Kết quả từ API:", data.image_base64);

            // 🟢 Map API data về đúng kiểu ScanResult
           const scanResult: ScanResult = {
            photo: "data:image/jpeg;base64," + base64Image,
            processedPhoto: "data:image/jpeg;base64," + data.image_base64, 
            detections: data.detections || [],
          };
          console.log("🔵 scanResult:", scanResult);

          // ✅ Điều hướng sang ResultScreen
          navigation.push("ResultScreen", { scanResult });
          } catch (err) {
            console.error("❌ Lỗi khi gọi API:", err);
          }
        }
      });
    };
    useFocusEffect(
      React.useCallback(() => {
        takePhotoAndDetect();
      }, [])
    );
    useEffect(() => {
      const openCam = async () => {
        const hasPermission = await requestCameraPermission();
        if (hasPermission) {
          takePhotoAndDetect();
        } else {
          console.log("🚫 Không có quyền camera");
        }
      };
      openCam();
    }, []);

    return null;
  };

  export default ScanGarbage;
