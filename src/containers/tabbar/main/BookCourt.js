import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import EHeader from '../../../components/common/EHeader';
import { Calendar } from 'react-native-calendars';
import { TouchableRipple } from 'react-native-paper';
import { commonColor, styles } from '../../../themes';
import { moderateScale } from '../../../common/constants';
import { colors } from 'react-native-swiper-flatlist/src/themes';
import EButton from '../../../components/common/EButton';
import { isAfter, format, parseISO } from 'date-fns';
import api from '../../../api/api';
import TimePicker from './TimePicker';

const BookCourt = ({ navigation,route }) => {
  const { user } = route.params;
console.log(user)
  const [selected, setSelected] = React.useState('');
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [layout, setLayOut] = React.useState('daily');
  const colors = useSelector(state => state.theme.theme);
  const item = route.params.item;

  const selectedTabStyle = {
    borderBottomWidth: 2, 
    borderColor: '#fff',
    position:'relative',
    bottom:0
  };
  
  const unselectedTabStyle = {
    color: '#fff',
    fontWeight: '600',
  };

  const Booking = (selectedDates, hall) => {

    if (!selectedDates || !selectedTime) {
      alert('Please select a date and time before booking.');
      return;
    }

    if (Array.isArray(selectedDates) && selectedDates.length > 1) {
      selectedDates.forEach(date => {
        const bookingData = {
          assign_time: selectedTime,
          booking_date: date,
          hall: hall,
          contact_id:user.contact_id
        };

        api
          .post('/booking/insertBooking', bookingData)
          .then(response => {
            if (response.status === 200) {
              alert('Thank You for booking court');
              setSelectedStartDate('')
              setSelectedEndDate('')
              setSelectedTime('')
              navigation.navigate('HomeTab', {insertedData: bookingData});
            } else {
              console.error('Error in booking for date:', date);
            }
          })
          .catch(error => {
            console.error('Error in booking for date:', date, error);
          });
      });
    } else if (selectedDates) {

      const bookingData = {
        assign_time: selectedTime,
        booking_date: selectedDates,
        hall: hall,
        contact_id:user.contact_id
      };

      api
        .post('/booking/insertBooking', bookingData)
        .then(response => {
          if (response.status === 200) {
            alert('Thank You for booking court');
            setSelected('');
            setSelectedTime('')
            navigation.navigate('HomeTab', {insertedData: bookingData});
          } else {
            alert('Error');
          }
        })
        .catch(error => {
          console.error('Error in booking for date:', selectedDates[0], error);
        });
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const renderLayout = () => {
    if (layout == 'daily') {
      return (
        <>
          <View style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Calendar
              style={{
                borderWidth: 1,
                borderColor: colors.backgroundColor,
                height: 340,
                borderRadius: moderateScale(5),
              }}
              theme={{
                selectedDayBackgroundColor: colors.backgroundColor,
                todayTextColor: colors.backgroundColor,
                arrowColor: colors.backgroundColor,
                'stylesheet.calendar.header': {
                  dayTextAtIndex0: {
                    color: 'red',
                  },
                  dayTextAtIndex6: {
                    color: 'green',
                  },
                },
              }}
              onDayPress={day => {
                setSelected(day.dateString);
              }}
              markedDates={{
                [selected]: {
                  selected: true,
                  disableTouchEvent: true,
                  selectedDotColor: colors.backgroundColor,
                },
              }}
            />

            <TimePicker setSelectedTime={setSelectedTime} />

            {selected && (
              <Text style={Attendancestyles.selectedDateText}>Selected Start Date: {selected}</Text>
            )}
            {selectedTime && (
              <Text style={Attendancestyles.selectedDateText}>Selected Time: {selectedTime}</Text>
            )}
          </View>

        </>
      );
    }
    else if (layout == 'Weekly') {
      return (
        <>
          <Calendar
            style={{
              borderWidth: 1,
              borderColor: colors.backgroundColor,
              height: 340,
            }}
            theme={{
              selectedDayBackgroundColor: colors.backgroundColor,
              todayTextColor: colors.backgroundColor,
              arrowColor: colors.backgroundColor,
              'stylesheet.calendar.header': {
                dayTextAtIndex0: {
                  color: 'red',
                },
                dayTextAtIndex6: {
                  color: 'green',
                },
              },
            }}
            initialDate={getCurrentDate()}
            markingType="period"
            onDayPress={(day) => handleDateSelect(day.dateString)}
            markedDates={getMarked()}
          />
          <TimePicker setSelectedTime={setSelectedTime} />

          {selectedStartDate && (
            <Text style={Attendancestyles.selectedDateText}>Selected Start Date: {selectedStartDate}</Text>
          )}
          {selectedEndDate && (
            <Text style={Attendancestyles.selectedDateText}>Selected End Date: {selectedEndDate}</Text>
          )}
           {selectedTime && (
              <Text style={Attendancestyles.selectedDateText}>Selected Time: {selectedTime}</Text>
            )}
        </>
      );
    }
  };

  const handleDateSelect = (date) => {
    if (selectedStartDate === null || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else if (selectedStartDate && !selectedEndDate) {
      setSelectedEndDate(date);
    }
  };

  const getMarked = () => {
    let marked = {};

    if (selectedStartDate && selectedEndDate) {
      const currentDate = new Date(selectedStartDate);
      while (currentDate <= new Date(selectedEndDate)) {
        const dateString = currentDate.toISOString().split('T')[0];
        marked[dateString] = {
          color: '#163a71',
          textColor: '#fff',
          disabled: true,
        };

        if (currentDate.toISOString().split('T')[0] === selectedStartDate) {
          marked[dateString].startingDay = true;
        }

        if (currentDate.toISOString().split('T')[0] === selectedEndDate) {
          marked[dateString].endingDay = true;
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return marked;
  };


  const getSelectedDates = () => {
    const selectedDates = [];
    if (selectedStartDate && selectedEndDate) {
      let currentDate = parseISO(selectedStartDate);
      while (!isAfter(currentDate, parseISO(selectedEndDate))) {
        selectedDates.push(format(currentDate, 'yyyy-MM-dd'));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    return selectedDates;
  };

  return (
    <View style={{ flex: 1 }}>
      <EHeader title={item.title} />

      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#e20e0ebd',
          justifyContent: 'space-around',
          padding: 10,
        }}>
        <TouchableRipple
          onPress={() => {
            setLayOut('daily');
          }}
          style={[Attendancestyles.head,layout === 'daily' ? selectedTabStyle : unselectedTabStyle]}
          >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Daily</Text>
        </TouchableRipple>
        <TouchableRipple
          onPress={() => {
            setLayOut('Weekly');
          }}
          style={[Attendancestyles.head,layout === 'Weekly' ? selectedTabStyle : unselectedTabStyle]}
          >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Weekly</Text>
        </TouchableRipple>
      </View>
      <ScrollView style={{ padding: 15 }}>{renderLayout()}</ScrollView>

      {layout === 'daily' && (
        <View style={{ padding: 20 }}>
          <EButton title="Book Daily Court" onPress={() => Booking(selected, item.title)} />
        </View>
      )}

      {layout === 'Weekly' && (
        <View style={{ padding: 20 }}>
          <EButton title="Book Weekly Court" onPress={() => Booking(getSelectedDates(), item.title)} />
        </View>
      )}

    </View>
  );
};

export default BookCourt;

const Attendancestyles = StyleSheet.create({
  header: {
    borderBottomWidth: 0.3,
    borderColor: '#FA7547',
    height: 100,
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginLeft: 15,
    color: '#4C4E66',
    marginVertical: 20,
  },
  head: {
    fontSize: 14,
  },
  content: {
    fontSize: 13,
    marginTop: 6,
  },
  head: {
    padding: 10,
  },

  innerContainer: {
    ...styles.mv20,
    borderRadius: moderateScale(5),
    borderWidth: 1,
    borderColor: '#FF9A7F',
  },

  heading: {
    fontSize: 14,
    fontWeight: '600',
  },
  subHeading: {
    fontSize: 12,
    color: commonColor.black,
    fontWeight: '600',
  },
  project: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  time: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FEE4D8',
    ...styles.pb10,
    ...styles.ph20,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  dateText: {
    textAlign: 'center',
    width: '100%',
    backgroundColor: '#000',
  },
  verticalLine: {
    borderLeftWidth: 1,
    borderColor: '#8F8E8E',
    height: '60%',
    alignSelf: 'center',
  },
  selectedDateText: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: 'bold'
  }
});
