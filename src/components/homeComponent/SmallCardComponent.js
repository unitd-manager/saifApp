import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

// Custom Imports
import EText from '../common/EText';
import { commonColor, styles } from '../../themes';
import { deviceWidth, getHeight, moderateScale } from '../../common/constants';

export default function SmallCardComponent({ item, index }) {
  const navigation = useNavigation();
  const colors = useSelector(state => state.theme.theme);

  // const onPressDetail = () => {
  //   // Navigate to the corresponding screen based on the URL
  //   if (item.url === 'ViewAttendace') {
  //     navigation.navigate('ViewAttendace');
  //   } else if (item.url === 'RequestLeave') {
  //     navigation.navigate('RequestLeave');
  //   } else if (item.url === 'ViewPayroll') {
  //     navigation.navigate('ViewPayroll');
  //   } else if (item.url === 'ViewHolidays') {
  //     navigation.navigate('ViewHolidays');
  //   }
  // };

  return (
    
    <TouchableOpacity
      style={[
        localStyles.root,
        index % 2 === 0 ? styles.mr5 : styles.ml5,
        { backgroundColor: colors.white ? '#fafafa' : colors.white },
      ]}
      // onPress={onPressDetail} 
      >

      <Image
        style={localStyles.imageStyle}
        source={item?.image}
      />

      <View style={localStyles.locationSubContainer}>
        <EText
          type={'S16'}
          numberOfLines={1}
          style={localStyles.textStyle}>
          {item?.title}
        </EText>

        <EText
          type={'S16'}
          numberOfLines={1}
          style={localStyles.price}>
          {'₹ 30'}
        </EText>
      </View>



    </TouchableOpacity>
  );
}

const localStyles = StyleSheet.create({
  root: {
    ...styles.pb10,
    ...styles.m10,
    ...styles.flex,
    ...styles.shadowStyle,
    ...styles.justifyCenter,
    width: (deviceWidth - moderateScale(120)) / 2,
    ...styles.mt15,
    borderRadius: moderateScale(10),
  },
  imageStyle: {
    width: '100%',
    height: getHeight(120),
    alignSelf: 'center',
    resizeMode: 'cover',
    borderRadius: moderateScale(10),
  },
  textStyle: {
    ...styles.flex,
    fontSize: 13,
  },
  locationSubContainer: {
    ...styles.flex,
    ...styles.flexRow,
    ...styles.itemsCenter,
    ...styles.p10,
  },
  locationContainer: {
    ...styles.rowSpaceBetween,
    ...styles.mt10,
    ...styles.mb5,
  },
  freeContainer: {
    height: moderateScale(22),
    width: moderateScale(36),
    borderRadius: moderateScale(8),
    ...styles.selfEnd,
    ...styles.center,
    backgroundColor: commonColor.primary5,
    right: moderateScale(10),
    top: moderateScale(10),
  },
  price: {
    backgroundColor: commonColor.primary5,
    color: commonColor.white,
    fontSize: 10,
    ...styles.p5,
  },
});
