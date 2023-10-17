import React, { useState,useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import EText from '../../../components/common/EText';

export const TimePicker = ({ setSelectedTime }) => {
  
  const initialTime = new Date();
  initialTime.setHours(0, 0, 0, 0);

  const [date, setDate] = useState(initialTime);
  const [mode, setMode] = useState('time');
  const [show, setShow] = useState(false);

const formatTime = (time) => {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const onChange = (event, selectedDate) => {
    setShow(false);

    const currentDate = selectedDate || date;

    const minTime = new Date(currentDate);
    minTime.setHours(6, 0, 0, 0);

    const maxTime = new Date(currentDate);
    maxTime.setHours(22, 0, 0, 0);

    if (currentDate >= minTime && currentDate <= maxTime) {
      setShow(false);
      setDate(currentDate);
      setSelectedTime(formatTime(currentDate));
    } else {
      alert('Please select a time between 6 AM and 10 PM.');
    }
  };

  const showTimepicker = () => {
    showMode('time');
    setShow(true);
  };

  const showMode = (currentMode) => {
    // setShow(true);
    setMode(currentMode);
  };

  useEffect(() => {
    return () => {
      setShow(false);
    };
  }, []);

  return (
    <SafeAreaView>
        <EText type="B16" color="#222" align="center" style={{marginVertical:20}}> Please Select Time </EText>
        <TouchableOpacity style={Attendancestyles.timeButton} onPress={showTimepicker}>
            <Text style={{fontWeight:'600'}} >Select Time</Text>
        </TouchableOpacity>
      
      {show && (
        <DateTimePicker
          testID="timePicker"
          value={date}
          mode={mode}
          accentColor="#13458cbd"
          is24Hour={true}
          onChange={onChange}
        />
      )}
    </SafeAreaView>
  );
};

export default TimePicker;

const Attendancestyles = StyleSheet.create({
  selectedDateText: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: 'bold'
  },
  timeButton: {
    width: '50%',
    height: 50,
    borderWidth:0.5,
    borderColor:'red',
    borderRadius:20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },

});