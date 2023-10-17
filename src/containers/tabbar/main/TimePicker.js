import React, { useState } from 'react';
import { Text, SafeAreaView, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export const TimePicker = () => {
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('time');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date; // Preserve the previous date if no new date is selected
    setShow(false);
    setDate(currentDate);
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  return (
    <SafeAreaView>
      <Button onPress={showTimepicker} title="Show time picker!" />
      {show && (
        <DateTimePicker
          testID="timePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
        />
      )}
      {date && mode === 'time' && (
        <Text>Selected Time: {date.toLocaleTimeString()}</Text>
      )}
    </SafeAreaView>
  );
};

export default TimePicker;