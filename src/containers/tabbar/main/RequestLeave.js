import {View, StyleSheet,TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import EHeader from '../../../components/common/EHeader';
import EInput from '../../../components/common/EInput';
import {styles} from '../../../themes';
import {Dropdown} from 'react-native-element-dropdown';
import {Year, LeaveType} from '../../../api/constant';
import {getHeight, moderateScale} from '../../../common/constants';
import EButton from '../../../components/common/EButton';
import { StackNav } from '../../../navigation/NavigationKeys';
import {useNavigation} from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import EText from '../../../components/common/EText';

const RequestLeave = (props) => {
  const navigation = useNavigation();
  const colors = useSelector(state => state.theme.theme);
  const BlurredStyle = {
    backgroundColor: colors.inputBg,
    borderColor: colors.backgroundColor,
  };
  const FocusedStyle = {
    backgroundColor: colors.inputBg,
    borderColor: colors.backgroundColor,
    color: colors.textColor
  };
  const [leaveType, setLeaveType] = useState('');
  const [nicknameInputStyle, setNicknameInputStyle] = useState(BlurredStyle);
  const [nickname, setNickname] = useState('');

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState('');

  const [year, setYear] = useState('');
  
  const onFocusInput = onHighlight => onHighlight(FocusedStyle);

  const onChangedLeaveType = text => setLeaveType(text.value.toLowerCase());
  const onChangedNickName = text => setNickname(text);
 const onFocusNickName = () => onFocusInput(setNicknameInputStyle);
 const onBlurNickName = () => onBlurInput(setNicknameInputStyle);
 

  const onChangedYear = text => setYear(text.value.toLowerCase());

  const onPressContinue = () => navigation.navigate(StackNav.GeneratePayslip);


    const handleDateConfirm = date => {
      var expiryDate = date.toISOString().split('T')[0];
      const day = expiryDate.split('-')[2];
      const month = expiryDate.split('-')[1];
      const year = expiryDate.split('-')[0];
      setDateOfBirth(day + '/' + month + '/' + year);
      setDatePickerVisible(false);
    };
  
    const hideDatePicker = () => setDatePickerVisible(false);

    const onPressCalender = () => setDatePickerVisible(true);

  return (
    <View style={{backgroundColor: '#fafafa', flex: 1}}>
      <EHeader title={'Request Leave'} />
      <View style={localStyles.contentContainerStyle}>

        <EInput
          placeHolder={'Total Days'}
          _value={nickname}
          style={{color:colors.placeHolderColor}}
          autoCapitalize={'none'}
          toGetTextFieldValue={onChangedNickName}
          inputContainerStyle={[
            {backgroundColor: colors.inputBg},
            localStyles.inputContainerStyle,
            nicknameInputStyle,
          ]}
          _onFocus={onFocusNickName}
          onBlur={onBlurNickName}
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
          data={LeaveType}
          maxHeight={moderateScale(180)}
          labelField="label"
          valueField="value"
          placeholder="Leave Type"
          value={leaveType}
          itemTextStyle={{
            color: colors.textColor,
            fontSize: moderateScale(16),
          }}
          onChange={onChangedLeaveType}
          selectedTextStyle={{
            color: colors.textColor,
          }}
          itemContainerStyle={{
            backgroundColor: colors.inputBg,
          }}
          activeColor={colors.inputBg}
        />

        {/* <Dropdown
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
        /> */}

<TouchableOpacity
          onPress={onPressCalender}
          style={[
            localStyles.dobStyle,
            {borderColor: colors.bColor, backgroundColor: colors.inputBg},
          ]}>
          <EText
            type={'r16'}
            color={dateOfBirth ? colors.textColor : colors.grayScale5}>
            {/* {dateOfBirth ? dateOfBirth : strings.dob} */}
          </EText>
          {/* <Ionicons
            name="calendar"
            size={moderateScale(20)}
            color={colors.grayScale5}
            style={styles.mr5}
          /> */}
        </TouchableOpacity>


<DateTimePickerModal
          isVisible={datePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePicker}
          date={new Date()}
          minimumDate={new Date()}
        />

        <EButton
          type={'S16'}
          title={'Submit Request'}
          color={colors.white}
          // onPress={onPressContinue}
          containerStyle={localStyles.continueBtnStyle}
        />
      </View>
    </View>
  );
};

export default RequestLeave;

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
    ...styles.mb10,
  },
  inputContainerStyle: {
    height: getHeight(60),
    borderRadius: moderateScale(5),
    borderWidth: moderateScale(1),
    ...styles.ph15,
  },
});
