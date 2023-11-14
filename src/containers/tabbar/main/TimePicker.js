import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';

const TimePicker = ({ setSelectedTime, setSelectedEndTime }) => {
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedHour, setSelectedHour] = useState('06');

  const showTimepicker = () => {
    setTimePickerVisible(true);
  };

  const hideTimepicker = () => {
    setTimePickerVisible(false);
  };

  const handleHourChange = (hour) => {
    setSelectedHour(hour);
    const period = hour >= 6 && hour < 12 ? 'AM' : 'PM';
    const formattedHour = (hour % 12 || 12).toString().padStart(2, '0');
    const formattedTime = `${formattedHour}:00 ${period}`;
    setSelectedTime(formattedTime);
    hideTimepicker();
  };

  const timeOptions = [];
  for (let hour = 6; hour <= 22; hour++) {
    const period = hour < 12 ? 'AM' : 'PM';
    const formattedHour = (hour % 12 || 12).toString().padStart(2, '0');
    timeOptions.push({ label: `${formattedHour}:00 ${period}`, value: hour.toString() });
  }

  const renderTimeOption = ({ item }) => (
    <TouchableOpacity style={styles.timeOption} onPress={() => handleHourChange(item.value)}>
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.timeButton} onPress={showTimepicker}>
        <Text style={{ fontWeight: '600' }}>Select Time</Text>
      </TouchableOpacity>
      {selectedHour && (
        <>
        </>
        // <Text style={styles.selectedTimeText}>Selected Time: {selectedHour}:00</Text>
      )}
      <Modal transparent visible={isTimePickerVisible} onRequestClose={hideTimepicker}>
        <TouchableWithoutFeedback onPress={hideTimepicker}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <FlatList
            data={timeOptions}
            keyExtractor={(item) => item.value}
            renderItem={renderTimeOption}
            style={styles.flatList}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeButton: {
    width: '100%',
    height: 50,
    borderWidth: 0.5,
    borderColor: 'red',
    borderRadius: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  // modalContent: {
  //   backgroundColor: 'white',
  //   borderTopLeftRadius: 20,
  //   borderTopRightRadius: 20,
  //   position: 'absolute',
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  // },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    position: 'absolute',
    bottom: '30%', // Adjusted position
    left: '10%', // Adjusted position
    right: '10%', // Adjusted position
  },
  flatList: {
    maxHeight: 200,
  },
  timeOption: {
    padding: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: 'gray',
  },
});

export default TimePicker;


// import React, { useState,useEffect } from 'react';
// import { Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';

// export const TimePicker = ({ setSelectedTime,setSelectedEndTime }) => {
  
//   const initialTime = new Date();
//   initialTime.setHours(0, 0, 0, 0);

//   const [date, setDate] = useState(initialTime);
//   const [mode, setMode] = useState('time');
//   const [show, setShow] = useState(false);

// const formatTime = (time) => {
//     return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };
  
//   const onChange = (event, selectedDate) => {
//     setShow(false);

//     const currentDate = selectedDate || date;

//     const minTime = new Date(currentDate);
//     minTime.setHours(6, 0, 0, 0);

//     const maxTime = new Date(currentDate);
//     maxTime.setHours(22, 0, 0, 0);

//     if (currentDate >= minTime && currentDate <= maxTime) {
//       setShow(false);
//       currentDate.setMinutes(0);
//       setDate(currentDate);
//       setSelectedTime(formatTime(currentDate));
//       setSelectedEndTime(formatTime(currentDate))
//     } else {
//       alert('Please select a time between 6 AM and 10 PM.');
//     }
//   };

//   const showTimepicker = () => {
//     showMode('time');
//     setShow(true);
//   };

//   const showMode = (currentMode) => {
//     setMode(currentMode);
//   };

//   useEffect(() => {
//     return () => {
//       setShow(false);
//     };
//   }, []);

//   return (
//     <SafeAreaView>
//         <TouchableOpacity style={Attendancestyles.timeButton} onPress={showTimepicker}>
//             <Text style={{fontWeight:'600'}} >Select Time</Text>
//         </TouchableOpacity>
      
//       {show && (
//         <DateTimePicker
//           testID="timePicker"
//           value={date}
//           mode={mode}
//           accentColor="#13458cbd"
//           is24Hour={false}
//           onChange={onChange}
//           minuteInterval={30}
//           display="spinner"
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// export default TimePicker;

// const Attendancestyles = StyleSheet.create({
//   selectedDateText: {
//     marginTop: 10,
//     fontSize: 15,
//     fontWeight: 'bold'
//   },
//   timeButton: {
//     width: '100%',
//     height: 50,
//     borderWidth:0.5,
//     borderColor:'red',
//     borderRadius:20,
//     alignSelf: 'center',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal:15
//   },

// });