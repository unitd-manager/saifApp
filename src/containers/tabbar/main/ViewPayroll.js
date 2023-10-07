import {View, StyleSheet,ScrollView} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import EHeader from '../../../components/common/EHeader';
import EText from '../../../components/common/EText';
import {styles} from '../../../themes';
import {Dropdown} from 'react-native-element-dropdown';
import {Year, Month} from '../../../api/constant';
import {getHeight, moderateScale} from '../../../common/constants';
import EButton from '../../../components/common/EButton';
import { StackNav } from '../../../navigation/NavigationKeys';
import {useNavigation} from '@react-navigation/native';

const ViewPayroll = () => {
  const navigation = useNavigation();
  const colors = useSelector(state => state.theme.theme);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const onChangedMonth = text => setMonth(text.value.toLowerCase());
  const onChangedYear = text => setYear(text.value.toLowerCase());

  const onPressContinue = () =>
    navigation.navigate(StackNav.GeneratePayslip
    //   , 
    //   {
    //   title: strings.payment,
    //   desc: strings.paymentDesc1,
    // }
    );

  return (
   
    <>
      {/* <View style={{backgroundColor: '#fafafa', flex: 1}}> */}
      <EHeader title={'Payslip'} />
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={localStyles.contentContainerStyle}>
        <EText type="b20" numberOfLines={1} color={colors.textcolor}>
          Generate Your{' '}
        </EText>
        <EText type="b20" numberOfLines={1} color={colors.textcolor}>
          Payslip Here
        </EText>
        <View style={localStyles.space}></View>
        <EText type="m12" numberOfLines={1} color={colors.textcolor}>
          Enter the required details
        </EText>
        <EText type="m12" numberOfLines={1} color={colors.textcolor}>
          below to generate your payslips
        </EText>

        <View style={localStyles.space}></View>
        <Dropdown
          style={[
            localStyles.dropdownStyle,
            {
              backgroundColor: colors.inputBg,
              borderColor: colors.backgroundColor,
              color: colors.white,
            },
          ]}
          placeholderStyle={{color: colors.grayScale5}}
          data={Month}
          maxHeight={moderateScale(180)}
          labelField="label"
          valueField="value"
          placeholder="Month"
          value={month}
          itemTextStyle={{
            color: colors.textColor,
            fontSize: moderateScale(16),
          }}
          onChange={onChangedMonth}
          selectedTextStyle={{
            color: colors.textColor,
          }}
          itemContainerStyle={{
            backgroundColor: colors.inputBg,
          }}
          activeColor={colors.inputBg}
        />
        <Dropdown
          style={[
            localStyles.dropdownStyle,
            {
              backgroundColor: colors.inputBg,
              borderColor: colors.backgroundColor,
              color: colors.white,
            },
          ]}
          placeholderStyle={{color: colors.grayScale5}}
          data={Year}
          maxHeight={moderateScale(180)}
          labelField="label"
          valueField="value"
          placeholder="Year"
          value={year}
          itemTextStyle={{
            color: colors.textColor,
            fontSize: moderateScale(16),
          }}
          onChange={onChangedYear}
          selectedTextStyle={{
            color: colors.textColor,
          }}
          itemContainerStyle={{
            backgroundColor: colors.inputBg,
          }}
          activeColor={colors.inputBg}
        />

       
      </View>

      </ScrollView>

      <EButton
          type={'S16'}
          title={'Generate Payslip'}
          color={colors.white}
          onPress={onPressContinue}
          containerStyle={localStyles.continueBtnStyle}
        />

      {/* </View> */}
    </>


    
  );
};

export default ViewPayroll;

const localStyles = StyleSheet.create({
  contentContainerStyle: {
    ...styles.ph25,
    ...styles.pv20,
  },
  space: {
    ...styles.pv10,
  },
  dropdownStyle: {
    height: getHeight(60),
    borderRadius: moderateScale(5),
    borderWidth: moderateScale(1),
    ...styles.ph25,
    ...styles.mv15,
  },
  continueBtnStyle: {
    ...styles.mh20,
    ...styles.mv10,
  },
});
