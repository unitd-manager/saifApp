import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
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
import EText from '../../../components/common/EText';

const BookCourt = ({ navigation, route }) => {
  const { user } = route.params;

  const [selected, setSelected] = React.useState('');
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [layout, setLayOut] = React.useState('daily');
  const colors = useSelector(state => state.theme.theme);
  const item = route.params.item;

  const selectedTabStyle = {
    borderBottomWidth: 2,
    borderColor: '#fff',
    position: 'relative',
    bottom: 0
  };

  const unselectedTabStyle = {
    color: '#fff',
    fontWeight: '600',
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    if (selectedEndTime && selectedEndTime <= time) {
      setSelectedEndTime(null);
    }
  };

  const SendEmailWeekly = (emailData) => {

    const to = user.email;
    const subject = "Saif Registration";

    if (Array.isArray(emailData) && emailData.length > 0) {
      const hall = emailData[0].hall;
      const fromTime = emailData[0].assign_time;
      const toTime = emailData[0].to_assign_time;
      const dateFromBooking = emailData[0].booking_date;
      const dateToBooking = emailData[emailData.length - 1].booking_date;

      api
        .post('/commonApi/sendUseremailBooking', {
          to,
          subject,
          fromTime,
          toTime,
          dateFromBooking,
          dateToBooking,
          hall,
        })
        .then(response => {
          if (response.status === 200) {
            Alert.alert('Booking Email Sent successfully');
          } else {
            console.error('Error');
          }
        });
    } else {
      // Handle the case of a single object
      const hall = emailData.hall;
      const fromTime = emailData.assign_time;
      const toTime = emailData.to_assign_time;
      const dateFromBooking = emailData.booking_date;
      const dateToBooking = emailData.selectedEndDate;

      // Now, you can send this data in the email
      api
        .post('/commonApi/sendUseremailBooking', {
          to,
          subject,
          fromTime,
          toTime,
          dateFromBooking,
          dateToBooking,
          hall,
        })
        .then(response => {
          if (response.status === 200) {
            Alert.alert('Booking Email Sent successfully');
          } else {
            console.error('Error');
          }
        });
    }
  };

  const handleEndTimeChange = (endTime) => {
    // Convert time strings to timestamps
    const selectedTimeTimestamp = getTimeStamp(selectedTime);
    const endTimeTimestamp = getTimeStamp(endTime);

    if (selectedTimeTimestamp && endTimeTimestamp <= selectedTimeTimestamp) {
      Alert.alert("End time must be after the start time.");
      return;
    } else {
      setSelectedEndTime(endTime);
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  // Function to convert time strings to timestamps
  function getTimeStamp(timeStr) {
    if (!timeStr) {
      return null;
    }

    // Parse the time string
    const [hours, minutes, period] = timeStr.split(/:| /);
    const isPM = period.toLowerCase() === "pm";
    const hour = parseInt(hours) % 12;
    const minute = parseInt(minutes);

    // Calculate the timestamp
    return isPM ? (hour + 12) * 60 + minute : hour * 60 + minute;
  }

  const Booking = (selectedDates, hall, price) => {

    // Check the selectedDates, selectedTime, selectedEndTime is not null
    if (!selectedDates || !selectedTime || !selectedEndTime) {
      Alert.alert('Please select a date and time before booking.');
      return;
    }

    // Start calculate the per hr rate
    const parseTime = (timeString) => {
      const [time, period] = timeString.split(' ');
      const [hours, minutes] = time.split(':');
      let hour = parseInt(hours);
      if (period.toLowerCase() === 'pm' && hour !== 12) {
        hour += 12;
      }
      const date = new Date();
      // date.setHours(hour, parseInt(minutes), 0, 0);
      date.setHours(hour, minutes, 0, 0);
      return date;
    };

    const startTime = parseTime(selectedTime);
    const endTime = parseTime(selectedEndTime);

    const timeDifferenceMs = endTime - startTime;

    // Calculate total minutes
    const totalMinutes = Math.floor(timeDifferenceMs / (1000 * 60));

    // Calculate hours and remaining minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours !== 1 || startTime.getMinutes() !== 0 || endTime.getMinutes() !== 0) {
      // Check if minutes are not zero
      if (startTime.getMinutes() !== 0 || endTime.getMinutes() !== 0) {
        Alert.alert('Please select minutes as 00, not as 01, 02, etc..');
        // Booking duration must be exactly 1 hour with 0 minutes. 
      } else {
        Alert.alert('You can\'t book more than 1 hour.');
        // Booking duration must be exactly 1 hour. 
      }
      return;
    }


    const formattedResult = '1 hour';

    // const formattedResult = `${hours} hours ${minutes} min`;

    const multipliedTimeDifference = (hours + minutes / 60) * price;

    // End calculate the per hr rate


    const bookingDates = [];
    const conflicts = [];

    if (Array.isArray(selectedDates) && selectedDates.length > 1) {
      const insertBooking = async (bookingData) => {
        try {
          const response = await api.post('/booking/insertBooking', bookingData);
          if (response.status === 200) {
            console.log('Booking inserted successfully');
            setTimeout(() => {
              navigation.navigate('HomeTab', { insertedData: bookingData });
            }, 500);
          } else {
            console.error('Error in booking for date:', bookingData.booking_date);
          }
        } catch (error) {
          console.error('Error in booking for date:', bookingData.booking_date, error);
        }
      };

      const promises = selectedDates.map(async date => {
        const bookingData = {
          assign_time: selectedTime,
          to_assign_time: selectedEndTime,
          booking_date: date,
          hall: hall,
          contact_id: user.contact_id,
          total_hour: formattedResult,
          total_hour_per_rate: multipliedTimeDifference,
        };

        bookingDates.push(bookingData);

        return api
          .post('/booking/checkBookingExistence', bookingData)
          .then((response) => {
            if (response.data.msg === 'Booking already exists for this time slot and date.') {
              conflicts.push(date);
            } else {
              return insertBooking(bookingData);
            }
          })
          .catch((error) => {
            console.error("AxiosError:", error);
          });
      });

      // Wait for all API requests to complete
      Promise.all(promises)
        .then(() => {
          if (conflicts.length > 0) {
            const conflictsMessage = 'Booking already exists for this time slot. Please select other time slot.';
            Alert.alert('Booking conflict', conflictsMessage);
          } else {
            const bookedDates = bookingDates.map((booking) => booking.booking_date).join(', ');
            Alert.alert('Thank You for booking court', 'Booked for dates: ' + bookedDates);
            setSelectedStartDate('');
            setSelectedEndDate('');
            setSelectedTime('');
            setSelectedEndTime('');
            SendEmailWeekly(bookingDates);
          }
        });

    }
    else if (selectedDates) {

      const bookingData = {
        assign_time: selectedTime,
        to_assign_time: selectedEndTime,
        booking_date: selectedDates,
        hall: hall,
        contact_id: user.contact_id,
        total_hour: formattedResult,
        total_hour_per_rate: multipliedTimeDifference,
      };


      console.log("bookingData Daily", bookingData)

      api.post('/booking/checkBookingExistence', bookingData)
        .then((response) => {
          if (response.data.msg === 'Booking already exists for this time slot and date.') {
            Alert.alert('Booking conflict', response.data.msg);
          } else {

            api
              .post('/booking/insertBooking', bookingData)
              .then(response => {
                if (response.status === 200) {
                  Alert.alert('Thank You for booking court');
                  SendEmailWeekly(bookingData)
                  setSelected('');
                  setSelectedTime('')
                  setSelectedEndTime('')
                  navigation.navigate('HomeTab', { insertedData: bookingData });
                } else {
                  Alert.alert('Error');
                }
              })
              .catch(error => {
                console.error('Error in booking for date:', selectedDates, error);
              });

          }
        })
        .catch((error) => {
          console.error("AxiosError:", error);
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
          <ScrollView style={{ paddingBottom: 30 }}>
            <View style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Calendar
                style={{
                  borderWidth: 1,
                  borderColor: colors.backgroundColor,
                  height: 360,
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
                  const selectedDate = new Date(day.dateString);
                  const today = new Date();
                  if (selectedDate < today) {
                    Alert.alert('Please select a date in the future.');
                  } else {
                    setSelected(day.dateString);
                  }
                }}

                markedDates={{
                  [selected]: {
                    selected: true,
                    disableTouchEvent: true,
                    selectedDotColor: colors.backgroundColor,
                  },
                }}
              />

              <EText type="B16" color="#222" align="center" style={{ marginVertical: 20 }}>Please Select Time</EText>
              <View style={Attendancestyles.time}>
                <View>
                  <EText type="B16" color="#222" align="center" style={{ marginVertical: 20 }}>Start Time </EText>
                  <TimePicker setSelectedTime={handleTimeChange} />
                </View>

                {selectedTime && (
                  <View>
                    <EText type="B16" color="#222" align="center" style={{ marginVertical: 20 }}>End Time</EText>
                    <TimePicker setSelectedTime={handleEndTimeChange} />
                  </View>
                )}
              </View>
              {selected && (
                <Text style={Attendancestyles.selectedDateText}>Selected Start Date: {selected.split('-').reverse().join('-')}</Text>
              )}
              {selectedTime && (
                <Text style={Attendancestyles.selectedDateText}>Selected Start Time: {selectedTime}</Text>
              )}
              {selectedEndTime && (
                <Text style={Attendancestyles.selectedDateText}>Selected End Time: {selectedEndTime}</Text>
              )}
            </View>
          </ScrollView>
        </>
      );
    }
    else if (layout == 'Weekly') {
      return (
        <>
          <ScrollView style={{ paddingBottom: 30 }}>
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

            <EText type="B16" color="#222" align="center" style={{ marginVertical: 20 }}>Please Select Time</EText>
            <View style={Attendancestyles.time}>
              <View>
                <EText type="B16" color="#222" align="center" style={{ marginVertical: 20 }}>Start Time </EText>
                <TimePicker setSelectedTime={handleTimeChange} />
              </View>

              {selectedTime && (
                <View>
                  <EText type="B16" color="#222" align="center" style={{ marginVertical: 20 }}>End Time</EText>
                  <TimePicker setSelectedTime={handleEndTimeChange} />
                </View>
              )}
            </View>

            {selectedStartDate && (
              <Text style={Attendancestyles.selectedDateText}>Selected Start Date: {selectedStartDate.split('-').reverse().join('-')} </Text>
            )}
            {selectedEndDate && (
              <Text style={Attendancestyles.selectedDateText}>Selected End Date: {selectedEndDate.split('-').reverse().join('-')} </Text>
            )}
            {selectedTime && (
              <Text style={Attendancestyles.selectedDateText}>Selected Start Time: {selectedTime}</Text>
            )}
            {selectedEndTime && (
              <Text style={Attendancestyles.selectedDateText}>Selected End Time: {selectedEndTime}</Text>
            )}

          </ScrollView>
        </>
      );
    }
  };

  const handleDateSelect = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();

    if (selectedDate < today) {
      Alert.alert('You can\'t select a past date');
    } else if (selectedStartDate === null || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else {
      const newSelectedEndDate = date;
      const startDate = new Date(selectedStartDate);
      const endDate = new Date(newSelectedEndDate);

      // Check if the new end date is after the start date
      if (endDate > startDate) {
        const dayDifference = Math.abs((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

        if (dayDifference < 2) {
          Alert.alert('Please select a minimum of 2 days.');
        } else if (dayDifference <= 7) {
          setSelectedEndDate(newSelectedEndDate);
        } else {
          Alert.alert('You can only select a maximum of 7 days.');
        }
      } else {
        Alert.alert("You can't select an end date earlier than the start date.");
      }
    }
  };

  const getMarked = () => {
    let marked = {};
    const today = new Date();

    if (selectedStartDate) {
      marked[selectedStartDate] = {
        color: '#163a71',
        textColor: '#fff',
        startingDay: true,
      };

      if (selectedEndDate) {
        const currentDate = new Date(selectedStartDate);
        while (currentDate <= new Date(selectedEndDate)) {
          const dateString = currentDate.toISOString().split('T')[0];
          marked[dateString] = {
            color: '#163a71',
            textColor: '#fff',
          };

          if (currentDate.toISOString().split('T')[0] === selectedEndDate) {
            marked[dateString].endingDay = true;
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    }

    const currentDate = new Date(selectedStartDate);
    while (currentDate < today) {
      const dateString = currentDate.toISOString().split('T')[0];
      marked[dateString] = {
        disabled: true,
        disableTouchEvent: true,
      };
      currentDate.setDate(currentDate.getDate() + 1);
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
      <EHeader title={item.key_text} />

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
          style={[Attendancestyles.head, layout === 'daily' ? selectedTabStyle : unselectedTabStyle]}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Daily</Text>
        </TouchableRipple>
        <TouchableRipple
          onPress={() => {
            setLayOut('Weekly');
          }}
          style={[Attendancestyles.head, layout === 'Weekly' ? selectedTabStyle : unselectedTabStyle]}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Weekly</Text>
        </TouchableRipple>
      </View>

      <ScrollView style={{ padding: 15 }}>{renderLayout()}</ScrollView>

      {layout === 'daily' && (
        <View style={{ padding: 20 }}>
          <EButton title="Book Daily Court" onPress={() => Booking(selected, item.key_text, item.value)} />
        </View>
      )}

      {layout === 'Weekly' && (
        <View style={{ padding: 20 }}>
          <EButton title="Book Weekly Court" onPress={() => Booking(getSelectedDates(), item.key_text, item.value)} />
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
    ...styles.pb10,
    ...styles.ph20,
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
    fontWeight: 'bold',
    color: '#36454F'
  }
});
