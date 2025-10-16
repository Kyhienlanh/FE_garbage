import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Modal,
  TouchableOpacity,
} from "react-native";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Detection } from "../types/Detection";
import CustomLoading from "./CustomLoading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import config from "../config/config";
import { Button } from "@react-navigation/elements";
import Icon from "react-native-vector-icons/Ionicons";

type ResultScreenRouteProp = RouteProp<RootStackParamList, "ResultScreen">;

const ResultScreen = () => {
  const route = useRoute<ResultScreenRouteProp>();
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  
  

  const [loading, setLoading] = useState(true); 
  const [modalVisible, setModalVisible] = useState(false);
  const { scanResult } = route.params;
  useEffect(() => {
    PostData(); 
  }, []);
  const PostData = async () => {
    if (!scanResult?.detections) return;

    const userID = await AsyncStorage.getItem("userID");
    if (!userID) return;

    try {
      for (const element of scanResult.detections) {
        let numbercategory=4
        if(element.category=='Tái chế'){
          numbercategory=1
        }
        else if(element.category=='Hữu cơ'){
           numbercategory=2
        }
         else if(element.category=='Nguy hại'){
           numbercategory=3
        }
        else{
           numbercategory=4
        }
        const response = await axios.post(`${config.API_BASE_URL}/ScanHistories`, {
          userID,
          scannedAt: new Date().toISOString(),
          WasteID:numbercategory,
          // base64: scanResult.processedPhoto,
          confidence: element.confidence.toString(),
          label: element.display_name,
          category: element.category
        });
        console.log("Sent:", response.data);
      }
    } catch (error) {
      console.error("Error sending scan history:", error);
    }
  };
  const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Tái chế": return "♻️";
    case "Hữu cơ": return "🌿";
    case "Nguy hại": return "☣️";
    default: return "🗑️";
  }
  };



  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
                      <TouchableOpacity onPress={() => navigation.navigate('bottomNavigation')} style={styles.iconButton}>
                        <Icon name="arrow-back" size={28} color="white" />
                      </TouchableOpacity>
      </View>
        <Text style={styles.title}>
          <Text style={{ fontSize: 24, color: "#0a84ff" }}>📸</Text> Kết quả phân loại rác
        </Text>


        {scanResult.processedPhoto ? (
          <>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image
                source={{ uri: scanResult.processedPhoto }}
                style={styles.image}
                resizeMode="contain"
                onLoadStart={() => setLoading(true)}   // ⏳ Bắt đầu tải
                onLoadEnd={() => setLoading(false)}     // ✅ Ảnh đã tải xong
              />
            </TouchableOpacity>

            {/* Modal xem ảnh to */}
            <Modal visible={modalVisible} transparent={true}>
              <View style={styles.modalContainer}>
                <TouchableOpacity
                  style={styles.closeArea}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeText}>✖</Text>
                </TouchableOpacity>
                <Image
                  source={{ uri: scanResult.processedPhoto }}
                  style={styles.fullImage}
                  resizeMode="contain"
                  onLoadStart={() => setLoading(true)}
                  onLoadEnd={() => setLoading(false)}
                />
              </View>
            </Modal>
          </>
        ) : (
          <Text>Không có ảnh</Text>
        )}

        <View style={styles.resultContainer}>
          {scanResult.detections.length > 0 ? (
            scanResult.detections.map((item: Detection, index: number) => (
              <View key={index} style={styles.resultCard}>
                <Text style={styles.resultText}>
                  • <Text style={styles.bold}>{item.display_name ?? item.label}</Text>
                </Text>
                <Text style={styles.detail}>
                  Nhãn: {item.label} | Độ tin cậy: {(item.confidence * 100).toFixed(2)}%
                </Text>
                <Text style={styles.category}>
                  {getCategoryIcon(item.category)} Loại rác: {item.category}
                </Text>

              </View>
            ))
          ) : (
            <Text>Không phát hiện vật thể nào</Text>
          )}
        </View>
      </ScrollView>
       {/* <TouchableOpacity onPress={PostData}>
             <Text>
              test nè
             </Text>
        </TouchableOpacity> */}

      {/* 🔵 Loading overlay */}
      <CustomLoading visible={loading} />
    </View>
  );
};

export default ResultScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 50,
    backgroundColor: "#f9f9f9",

  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  image: {
    width: 350,
    height: 350,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  resultContainer: {
    width: "100%",
    marginTop: 10,
  },
 resultCard: {
  backgroundColor: "#d9ece1ff",
  borderRadius: 12,
  padding: 16,
  marginBottom: 12,
  borderLeftWidth: 5,
  borderLeftColor: "#26a731ff",
},

  resultText: {
    fontSize: 16,
    color: "#222",
  },
  detail: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  category: {
    fontSize: 14,
    color: "#5bbe9dff",
    marginTop: 4,
    fontWeight: "600",
  },
  bold: {
    fontWeight: "bold",
    color: "#000",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeArea: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  closeText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  fullImage: {
    width: "100%",
    height: "80%",
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
   iconButton: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30,
  }, 
});
