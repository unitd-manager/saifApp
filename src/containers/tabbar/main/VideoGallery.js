import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';

const videos = [
  {
    id: '1',
    title: 'Video 1',
    url: 'https://www.youtube.com/watch?v=VIDEO_ID_1',
  },
  {
    id: '2',
    title: 'Video 2',
    url: 'https://www.youtube.com/watch?v=VIDEO_ID_2',
  },
  // Add more videos as needed
];

const VideoGallery = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleVideoPress = (video) => {
    setSelectedVideo(video);
    // You can handle what to do when a video is selected, like opening it in a WebView or a video player.
    // For simplicity, let's log the selected video URL for now.
    console.log(`Selected video URL: ${video.url}`);
  };

  const renderVideoItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleVideoPress(item)} style={styles.videoItem}>
      <Text>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No videos available</Text>}
      />
      {selectedVideo && (
        <View style={styles.selectedVideoContainer}>
          <Text>Selected Video: {selectedVideo.title}</Text>
          {/* Render the selected video here */}
        </View>
      )}
    </View>
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
});

export default VideoGallery;
