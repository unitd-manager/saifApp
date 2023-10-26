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


  console.log("item",item)

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
    const fromTime = emailData.assign_time;
    const toTime = emailData.to_assign_time;
    const dateFromBooking = emailData.booking_date;
    // const dateToBooking =emailData.selectedEndDate;
    const hall = emailData.hall;
    api
      .post('/commonApi/sendUseremailBooking', { to, subject, fromTime, toTime, dateFromBooking, hall })
      .then(response => {
        if (response.status === 200) {
          alert('Email sent successfully');
          // setTimeout(() => {
          //    navigation.navigate(StackNav.Login)
          //   }, 500);
        } else {
          console.error('Error');
        }
      })
  }

  const handleEndTimeChange = (endTime) => {
    if (selectedTime && endTime <= selectedTime) {
      alert("End time must be after the start time.");
    } else {
      setSelectedEndTime(endTime);
    }
  };

  const Booking = (selectedDates, hall, price) => {
    // Check the selectedDates, selectedTime, selectedEndTime is not null
    if (!selectedDates || !selectedTime || !selectedEndTime) {
      alert('Please select a date and time before booking.');
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
      date.setHours(hour, parseInt(minutes), 0, 0);
      return date;
    };

    const startTime = parseTime(selectedTime);
    const endTime = parseTime(selectedEndTime);
    const rate = 30;

    const timeDifferenceMs = endTime - startTime;

    const hours = Math.floor(timeDifferenceMs / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifferenceMs % (1000 * 60 * 60)) / (1000 * 60));

    const formattedResult = `${hours} hours ${minutes} min`;

    const multipliedTimeDifference = (hours + minutes / 60) * rate;

    // End calculate the per hr rate

    if (Array.isArray(selectedDates) && selectedDates.length > 1) {
      selectedDates.forEach(date => {
        const bookingData = {
          assign_time: selectedTime,
          to_assign_time: selectedEndTime,
          booking_date: date,
          hall: hall,
          contact_id: user.contact_id,
          total_hour: formattedResult,
          total_hour_per_rate: price,
        };

        api
          .post('/booking/insertBooking', bookingData)
          .then(response => {
            if (response.status === 200) {
              setSelectedStartDate('')
              setSelectedEndDate('')
              setSelectedTime('')
              setSelectedEndTime('')
              SendEmailWeekly(bookingData)
              navigation.navigate('HomeTab', { insertedData: bookingData });
            } else {
              console.error('Error in booking for date:', date);
            }
          })
          .catch(error => {
            console.error('Error in booking for date:', date, error);
          });
      });

      alert('Thank You for booking court');
    } else if (selectedDates) {

      const bookingData = {
        assign_time: selectedTime,
        to_assign_time: selectedEndTime,
        booking_date: selectedDates,
        hall: hall,
        contact_id: user.contact_id,
        total_hour: formattedResult,
        total_hour_per_rate: price,
      };

      api
        .post('/booking/insertBooking', bookingData)
        .then(response => {
          if (response.status === 200) {
            alert('Thank You for booking court');
            setSelected('');
            setSelectedTime('')
            setSelectedEndTime('')
            SendEmailWeekly(bookingData)
            navigation.navigate('HomeTab', { insertedData: bookingData });
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
          <ScrollView style={{ paddingBottom: 30 }}>
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
                  const selectedDate = new Date(day.dateString);
                  const today = new Date();
                  if (selectedDate < today) {
                    alert('Please select a date in the future.');
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
                <Text style={Attendancestyles.selectedDateText}>Selected Start Date: {selected}</Text>
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
              <Text style={Attendancestyles.selectedDateText}>Selected Start Date: {selectedStartDate}</Text>
            )}
            {selectedEndDate && (
              <Text style={Attendancestyles.selectedDateText}>Selected End Date: {selectedEndDate}</Text>
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
      alert('You can\'t select a past date');
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
          alert('Please select a minimum of 2 days.');
        } else if (dayDifference <= 7) {
          setSelectedEndDate(newSelectedEndDate);
        } else {
          alert('You can only select a maximum of 7 days.');
        }
      } else {
        alert("You can't select an end date earlier than the start date.");
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
    fontWeight: 'bold'
  }
});
