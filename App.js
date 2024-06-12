import React, { useState } from 'react';
import MapView, { Marker, Polygon, Polyline } from 'react-native-maps';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


export default function App() {

  const [markerIndex, setMarkerIndex] = useState(0);
  const [markers, setMarkers] = useState([]);
  const [markerPositions, setMarkerPositions] = useState([]);

  function handleMarkerDrag(selectedMarkerId, newCoordinate) {
    const updatedMarkers = markers.map((marker, index) => {
      if (index === selectedMarkerId) {
        const updatedMarker = {
          id: index,
          position: newCoordinate
        }
        return updatedMarker;
      } else {
        return marker;
      }
    })
    setMarkers(updatedMarkers);
  }

  function deleteLastMarker() {
    setMarkers(markers => markers.slice(0, -1));
    setMarkerPositions(extractedPositions => extractedPositions.slice(0, -1))
    setMarkerIndex(markerIndex => markerIndex - 1)
  }

  function extractMarkerPositions() {
    const extractedPositions = markers.map((marker) => {
      return marker.position;
    })
    setMarkerPositions(extractedPositions)
  }



  return (
    <>
      <View style={styles.container}>
        <MapView style={styles.map}
          initialRegion={{
            latitude: 42.6910688,
            longitude: 23.3181052,
            latitudeDelta: 0.1,
            longitudeDelta: 0.05
          }}
          onPress={(event) => {
            setMarkerIndex(markerIndex => markerIndex + 1)
            const newMarker = {
              id: markerIndex,
              position: event.nativeEvent.coordinate
            }
            setMarkers([...markers, newMarker])
            setMarkerPositions([...markerPositions, newMarker.position])
          }}
          mapType='mutedStandard'
        >
          {markers && markers.map((marker) => {
            return (
              <Marker
                draggable
                coordinate={marker.position}
                id={marker.id}
                key={marker.id}
                onDrag={(event) => {
                  const selectedMarkerId = marker.id;
                  const newCoordinate = event.nativeEvent.coordinate;
                  handleMarkerDrag(selectedMarkerId, newCoordinate)
                  extractMarkerPositions()
                }}
                // Rapid Marker Movement Handling
                onDragEnd={(event) => {
                  const selectedMarkerId = marker.id;
                  const newCoordinate = event.nativeEvent.coordinate;
                  handleMarkerDrag(selectedMarkerId, newCoordinate)
                  extractMarkerPositions()
                }}
              />
            )
          })}

          {markerPositions && markerPositions.length === 2
            && (
              <Polyline coordinates={
                markerPositions}
                strokeColor="red"
                strokeWidth={2}
              />
            )}

          {markerPositions && markerPositions.length >= 3
            && (
              <Polygon coordinates={
                markerPositions}
                strokeColor="red"
                strokeWidth={2}
                fillColor="rgba(255, 0, 0, 0.5)"
              />
            )}
        </MapView>

      </View>

      <View style={styles.wrapper}>
        {markerPositions.length !== 0 && (
          <TouchableOpacity style={styles.button}
            onPress={() => { deleteLastMarker() }}
          >
            <Icon name="undo" size={30} color="white" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.button}
          onPress={() => { }}
        >
          <Icon name="map-marker" size={30} color="white" />
        </TouchableOpacity>


      </View>

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    marginTop: 30,
    width: '100%',
    height: '100%',
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    bottom: 0,
    position: 'absolute',
    zIndex: 10000,
  },
  button: {
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'silver',
    margin: 15,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  }

});
