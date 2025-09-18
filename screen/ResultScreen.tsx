import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Modal,
  TouchableOpacity,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Detection } from "../types/Detection";

type ResultScreenRouteProp = RouteProp<RootStackParamList, "ResultScreen">;

const ResultScreen = () => {
  const route = useRoute<ResultScreenRouteProp>();
  const { scanResult } = route.params;

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📸 Kết quả phân loại rác</Text>

      {scanResult.processedPhoto ? (
        <>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={{ uri: scanResult.processedPhoto }}
              style={styles.image}
              resizeMode="contain"
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
                Nhãn: {item.label} | Độ tin cậy:{" "}
                {(item.confidence * 100).toFixed(2)}%
              </Text>
              <Text style={styles.category}>Loại rác: {item.category}</Text>
            </View>
          ))
        ) : (
          <Text>Không phát hiện vật thể nào</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default ResultScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
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
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
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
    color: "#0a84ff",
    marginTop: 4,
    fontWeight: "600",
  },
  bold: {
    fontWeight: "bold",
    color: "#000",
  },
  // Modal
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
});
