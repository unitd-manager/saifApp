import React, { useState, useEffect } from 'react';
import { View, StyleSheet,Text, ScrollView } from 'react-native';
import EHeader from '../../../components/common/EHeader';
import EI from 'react-native-vector-icons/EvilIcons';
import WebView from 'react-native-webview';
import api from '../../../api/api';

// const videos = [
//   {
//     id: '1',
//     title: 'Video 1',
//     categ: 'Arts & Culture',
//     url: 'Ntkt06bD698',
//     imag: require('../../../assets/images/ArtsCulture.jpg'),
//   },
//   {
//     id: '2',
//     title: 'Video 2',
//     categ: 'Arts & Culture',
//     url: 'd5fMOEodxc4',
//     imag: require('../../../assets/images/hqdefault.jpg'),
//   },
//   {
//     id: '3',
//     title: 'Video 3',
//     categ: 'Arts & Culture',
//     url: 'a_mdVd9MdGA',
//     imag: require('../../../assets/images/ArtsCulture.jpg'),
//   },
//   {
//     id: '4',
//     title: 'Video 4',
//     categ: 'Arts & Culture',
//     url: 'DxSUVXEmt4E',
//     imag: require('../../../assets/images/hqdefault.jpg'),
//   },
// ];

const VideoGallery = () => {

  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true);

  const VidGallery = () => {
      api
          .get('/content/getVideoForApp')
          .then((res) => {
              setVideos(res.data.data);
              setLoading(false);
          })
          .catch((error) => {
              console.log('Error fetching data:', error);
          });
  };

  useEffect(() => {
      VidGallery();
  }, [])



  return (
    <>

      <EHeader title="Video Gallery" />

<ScrollView>
      {videos.map((item) => (

        <View key={item.id} style={styles.singleContainer}>
          <View style={styles.cardTopRow}>
            <View style={styles.halrow}>
              <View style={{ flexDirection: 'column' }}>
                <Text style={styles.head}>{item.title}</Text>
                <Text style={styles.headdesp}>{item.content_type}</Text>
              </View>
            </View>
          </View>

          <WebView
            source={{ html: `<iframe src="https://www.youtube.com/embed/${item.description.replace(/<\/?p>/g, '').trim()}?rel=0" width="100%" height="450" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>` }}
            allowsFullscreenVideo={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error('WebView error: ', nativeEvent);
            }}
          />

          <View
            style={{
              marginBottom: 20,
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <EI size={25} color="#000" name="user" style={styles.backIcon}></EI>
              <Text style={styles.headdesp}>artist</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <EI size={25} color="#000" name="calendar" style={styles.backIcon}></EI>
              <Text style={styles.headdesp}>{item.creation_date}</Text>
            </View>
          </View>
        </View>
      ))}
</ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  videoItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  selectedVideoContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },



  button: {
    backgroundColor: 'green',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 5,
    borderRadius: 3
  },
  buttonText: {
    color: '#fff'
  },
  singleContainer: {
    backgroundColor: '#fff',
    marginTop: 20,
    borderRadius: 10,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
    paddingHorizontal: 20,
    marginHorizontal: 15,
    height: 270
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  halrow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moredot: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallDot: {
    width: 5,
    height: 5,
    borderRadius: 5,
  },
  head: {
    fontSize: 16,
    color: '#163a71',
    fontWeight: '600'
  },
  headdesp: {
    fontSize: 12,
    color: '#222',
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4C4E66',
    lineHeight: 36,
    marginLeft: 10,
  },
});

export default VideoGallery;
