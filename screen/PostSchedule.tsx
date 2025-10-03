import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

interface Marker {
  latitude: number;
  longitude: number;
  title: string;
}

const PostSchedule = () => {
  const markers: Marker[] = [
    { latitude: 10.7769, longitude: 106.7009, title: 'Marker 1' },
    { latitude: 10.7790, longitude: 106.7020, title: 'Marker 2' },
    { latitude: 10.7775, longitude: 106.7015, title: 'Marker 3' },
  ];

  const generateMarkerScript = (markers: Marker[]) => {
    return markers
      .map(
        m => `
          var marker = L.marker([${m.latitude}, ${m.longitude}]).addTo(map);
          marker.bindPopup("<b>${m.title}</b>").openPopup();
        `
      )
      .join('\n');
  };

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Leaflet Map</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <style>
          html, body, #map { height: 100%; margin:0; padding:0; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map').setView([10.7769, 106.7009], 14);
          L.tileLayer('https://a.tile.openstreetmap.de/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          ${generateMarkerScript(markers)}
        </script>
      </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={{ flex: 1 }}
      />
    </View>
  );
};

export default PostSchedule;
