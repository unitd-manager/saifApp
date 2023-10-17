import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const generateTimeSlots = (startTime, endTime, interval) => {
  const timeSlots = [];
  let currentTime = new Date(startTime);

  while (currentTime < endTime) {
    const slotStart = new Date(currentTime);
    const slotEnd = new Date(currentTime);
    slotEnd.setMinutes(currentTime.getMinutes() + interval);

    const slot = {
      start: slotStart,
      end: slotEnd,
      selected: false, // Add a selected property
    };

    timeSlots.push(slot);
    currentTime.setMinutes(currentTime.getMinutes() + interval);
  }

  return timeSlots;
};

const TimeSlotList = () => {
  const startTime = new Date('2023-10-16T06:00:00');
  const endTime = new Date('2023-10-16T22:00:00');
  const timeInterval = 60;

  const [timeSlots, setTimeSlots] = useState(generateTimeSlots(startTime, endTime, timeInterval));

  const handleTimeSlotPress = (index) => {
    const updatedTimeSlots = [...timeSlots];
    updatedTimeSlots[index].selected = !updatedTimeSlots[index].selected;
    setTimeSlots(updatedTimeSlots);
  };

  return (
    <View style={styles.container}>
      <Text>Available Time Slots:</Text>
      <FlatList
        data={timeSlots}
        numColumns={4} // Display four slots in a row
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => handleTimeSlotPress(index)}
            style={[
              styles.timeSlot,
              { backgroundColor: item.selected ? 'lightgreen' : 'lightblue' },
            ]}
          >
            <Text style={styles.slotText}>
              {item.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
              {item.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
        )}
      />
      {/* <TouchableOpacity
        onPress={() => {
          const selectedSlots = timeSlots.filter((slot) => slot.selected);
          console.log('Selected Time Slots:', selectedSlots);
        }}
        style={styles.selectButton}
      >
        <Text style={styles.buttonText}>Select Slots</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
  },
  timeSlot: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 5,
  },
  slotText: {
    textAlign: 'center',
  },
  selectButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 10,
  },
  buttonText: {
    color: 'white',
  },
});

export default TimeSlotList;