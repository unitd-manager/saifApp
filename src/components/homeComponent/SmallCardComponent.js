import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import EText from '../common/EText';
import { commonColor, styles } from '../../themes';
import { deviceWidth, getHeight, moderateScale } from '../../common/constants';
import images from '../../assets/images';

export default function SmallCardComponent({ item, index, user }) {

  const navigation = useNavigation();
  const colors = useSelector(state => state.theme.theme);

  const onPressDetail = () => {
    navigation.navigate('BookCourt', { item, user });
  };

  return (
    <TouchableOpacity
      style={[
        localStyles.root,
        index % 2 === 0 ? styles.mr5 : styles.ml5,
        { backgroundColor: colors.white ? '#fafafa' : colors.white },
      ]}
      onPress={onPressDetail}
    >
      {item?.setting_id === 358 ?
        <Image
          style={localStyles.imageStyle}
          source={images.court1}
        />
        : <Image
          style={localStyles.imageStyle}
          source={images.court2}
        />
      }

      <View style={localStyles.locationSubContainer}>
        <EText
          type={'S16'}
          numberOfLines={1}
          style={localStyles.textStyle}>
          {item?.key_text}
        </EText>

        <EText
          type={'S16'}
          numberOfLines={1}
          style={localStyles.price}>
          {'₹/hr '}{item?.value}
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
    backgroundColor: '#000'
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
