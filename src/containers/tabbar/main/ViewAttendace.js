import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import EHeader from '../../../components/common/EHeader';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {TouchableRipple} from 'react-native-paper';
import {commonColor, styles} from '../../../themes';
import {moderateScale} from '../../../common/constants';
import {colors} from 'react-native-swiper-flatlist/src/themes';
import {Calender, CardClock, CheckIn} from '../../../assets/svgs';

const ViewAttendace = () => {
  const [selected, setSelected] = React.useState('');
  const [layout, setLayOut] = React.useState('daily');
  const colors = useSelector(state => state.theme.theme);

  const InnerContainer = ({children}) => {
    return (
      <View
        style={[
          Attendancestyles.innerContainer,
          {backgroundColor: colors.dark ? colors.dark2 : colors.grayScale1},
        ]}>
        {children}
      </View>
    );
  };

  const renderLayout = () => {
    if (layout == 'daily') {
      return (
        <>
          <Calendar
            style={{
              borderWidth: 1,
              borderColor: '#FF9A7F',
              height: 350,
              borderRadius: moderateScale(5),
            }}
            theme={{
              selectedDayBackgroundColor: '#FF9A7F',
              todayTextColor: '#FF9A7F',
              arrowColor: '#FF9A7F',
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
                selectedDotColor: 'orange',
              },
            }}
          />

          <InnerContainer>
            <View
              style={[
                Attendancestyles.project,
                {
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  paddingRight: 20,
                },
              ]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Calender />
                <View>
                  <Text style={Attendancestyles.subHeading}>Friday</Text>
                  <Text style={Attendancestyles.heading}>4 Aug 2023</Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CardClock />
                <View>
                  <Text style={Attendancestyles.subHeading}>Total</Text>
                  <Text style={Attendancestyles.heading}>9:00:00</Text>
                </View>
              </View>
            </View>

            <View style={Attendancestyles.time}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View>
                  <CheckIn />
                  <Text style={Attendancestyles.subHeading}>Check In</Text>
                </View>
                <Text style={Attendancestyles.heading}>10:00 AM</Text>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View>
                  <CheckIn />
                  <Text style={Attendancestyles.subHeading}>Check Out</Text>
                </View>
                <Text style={Attendancestyles.heading}>07:00 PM</Text>
              </View>
            </View>
          </InnerContainer>
        </>
      );
    } else if (layout == 'monthly') {
      return (
        <>
          {/* 
<FlatList
                data={LIST}
                renderItem={({ item,index })=>(
                    <>
                    <View style={styles.debtListBox}>
                        <View style={styles.items}>
                                <View style={styles.itemLeft}>
                                    <Image
                                        style={styles.tinyLogo}
                                        source={item.profileImg}
                                        />
                                    <View>
                                        <Text style={{fontSize:20,color:color.Primary,fontFamily:fontfamily.semibold}}>{item.name}</Text>
                                        <Text style={{fontSize:14,color:color.textColor,fontFamily:fontfamily.semibold}}>{item.date}</Text>
                                    </View>
                                </View>
                                <View>
                                    <Text style={styles.amountDetail}>{item.amount}</Text>
                                    <Text style={[styles.amountDetail,{backgroundColor:color.success,paddingHorizontal:7,paddingVertical:3,borderRadius:55,color:color.White}]}>{item.Remind}</Text>
                                </View>
                        </View>
                    </View>     
                </> 
              )}
              keyExtractor={item => item.id}
            /> */}

          <View style={{flex: 1}}>
            <Calendar
              style={{
                borderWidth: 1,
                borderColor: '#FF9A7F',
                height: 350,
              }}
              initialDate="2023-08-01"
              markingType="period"
              markedDates={getMarked()}
            />

            <InnerContainer>
              <View
                style={[
                  Attendancestyles.project,
                  {
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingRight: 20,
                  },
                ]}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Calender />
                  <View>
                    <Text style={Attendancestyles.subHeading}>Friday</Text>
                    <Text style={Attendancestyles.heading}>4 Aug 2023</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <CardClock />
                  <View>
                    <Text style={Attendancestyles.subHeading}>Total</Text>
                    <Text style={Attendancestyles.heading}>9:00:00</Text>
                  </View>
                </View>
              </View>

              <View style={Attendancestyles.time}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View>
                    <CheckIn />
                    <Text style={Attendancestyles.subHeading}>Check In</Text>
                  </View>
                  <Text style={Attendancestyles.heading}>10:00 AM</Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View>
                    <CheckIn />
                    <Text style={Attendancestyles.subHeading}>Check Out</Text>
                  </View>
                  <Text style={Attendancestyles.heading}>07:00 PM</Text>
                </View>
              </View>
            </InnerContainer>

            <InnerContainer>
              <View
                style={[
                  Attendancestyles.project,
                  {
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingRight: 20,
                  },
                ]}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Calender />
                  <View>
                    <Text style={Attendancestyles.subHeading}>Friday</Text>
                    <Text style={Attendancestyles.heading}>4 Aug 2023</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <CardClock />
                  <View>
                    <Text style={Attendancestyles.subHeading}>Total</Text>
                    <Text style={Attendancestyles.heading}>9:00:00</Text>
                  </View>
                </View>
              </View>

              <View style={Attendancestyles.time}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View>
                    <CheckIn />
                    <Text style={Attendancestyles.subHeading}>Check In</Text>
                  </View>
                  <Text style={Attendancestyles.heading}>10:00 AM</Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View>
                    <CheckIn />
                    <Text style={Attendancestyles.subHeading}>Check Out</Text>
                  </View>
                  <Text style={Attendancestyles.heading}>07:00 PM</Text>
                </View>
              </View>
            </InnerContainer>

            <InnerContainer>
              <View
                style={[
                  Attendancestyles.project,
                  {
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingRight: 20,
                  },
                ]}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Calender />
                  <View>
                    <Text style={Attendancestyles.subHeading}>Friday</Text>
                    <Text style={Attendancestyles.heading}>4 Aug 2023</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <CardClock />
                  <View>
                    <Text style={Attendancestyles.subHeading}>Total</Text>
                    <Text style={Attendancestyles.heading}>9:00:00</Text>
                  </View>
                </View>
              </View>

              <View style={Attendancestyles.time}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View>
                    <CheckIn />
                    <Text style={Attendancestyles.subHeading}>Check In</Text>
                  </View>
                  <Text style={Attendancestyles.heading}>10:00 AM</Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View>
                    <CheckIn />
                    <Text style={Attendancestyles.subHeading}>Check Out</Text>
                  </View>
                  <Text style={Attendancestyles.heading}>07:00 PM</Text>
                </View>
              </View>
            </InnerContainer>
          </View>
        </>
      );
    }
  };

  const getMarked = () => {
    let marked = {};
    for (let i = 4; i <= 6; i++) {
      let day = i.toString().padStart(2, '0');
      marked[`2023-08-${day}`] = {
        startingDay: i == 4,
        endingDay: i == 6,
        color: '#FF9A7F',
        textColor: '#fff',
        disabled: true,
      };
    }
    return marked;
  };

  return (
    <View>
      <EHeader title={'Attendance Report'} />

      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#FF9A7F',
          justifyContent: 'space-around',
          padding: 10,
        }}>
        <TouchableRipple
          onPress={() => {
            setLayOut('daily');
          }}
          style={Attendancestyles.head}>
          <Text style={{color: '#fff', fontWeight: '600'}}>Daily</Text>
        </TouchableRipple>
        <TouchableRipple
          onPress={() => {
            setLayOut('monthly');
          }}
          style={Attendancestyles.head}>
          <Text style={{color: '#fff', fontWeight: '600'}}>Monthly</Text>
        </TouchableRipple>
      </View>
      <ScrollView style={{padding: 15}}>{renderLayout()}</ScrollView>
    </View>
  );
};

export default ViewAttendace;

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
});
