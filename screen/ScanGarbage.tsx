import { StyleSheet, Text, View, Button, Image } from 'react-native'
import React, { useState } from 'react'
import { launchCamera } from 'react-native-image-picker'

const ScanGarbage = () => {
  const [photo, setPhoto] = useState<any>(null)

  const openCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        saveToPhotos: true,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled camera')
        } else if (response.errorCode) {
          console.log('Camera Error: ', response.errorMessage)
        } else {
          const source = response.assets?.[0].uri
          setPhoto(source)
        }
      }
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Garbage</Text>
      <Button title="Mở Camera" onPress={openCamera} />

      {photo && (
        <Image
          source={{ uri: photo }}
          style={styles.image}
        />
      )}
    </View>
  )
}

export default ScanGarbage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 400,
    marginTop: 20,
    borderRadius: 10,
  },
})
