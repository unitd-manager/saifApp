import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,Text
} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Downloads} from '../../../assets/svgs';

// Local import
import EHeader from '../../../components/common/EHeader';
import strings from '../../../i18n/strings';
import {styles} from '../../../themes';
import {getHeight, moderateScale} from '../../../common/constants';
import EText from '../../../components/common/EText';
import EDivider from '../../../components/common/EDivider';

export default function GeneratePayslip() {
  const colors = useSelector(state => state.theme.theme);
  const textColor2 = colors.dark ? colors.grayScale3 : colors.grayScale7;

  const InnerContainer = ({children}) => {
    return (
      <View
        style={[
          localStyles.innerContainer,
          {backgroundColor: colors.dark ? colors.dark2 : colors.grayScale1},
        ]}>
        {children}
      </View>
    );
  };

  const InnerText = props => {
    const {
      text1,
      text2,
      isBottom = true,
      isPaid = true,
      isCopy = false,
    } = props;
    return (
      <View style={[styles.rowSpaceBetween, isBottom && styles.pb15]}>
        <EText color={textColor2} type={'s14'}>
          {text1}
        </EText>
        {!!isPaid ? (
          <View style={[styles.flexRow, styles.itemsCenter]}>
            <EText type={'B16'}>{text2}</EText>
            {isCopy && (
              <TouchableOpacity>
                <MaterialIcons
                  name="content-copy"
                  size={moderateScale(18)}
                  color={colors.primary5}
                  style={styles.ml5}
                />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View
            style={[localStyles.paidContainer, {borderColor: colors.primary5}]}>
            <EText color={colors.primary5} type={'s12'}>
              {strings.paid}
            </EText>
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <EHeader title={'Payslip'} rightIcon={<Downloads />} />
      <ScrollView showsVerticalScrollIndicator={false}>

        <InnerContainer>
          <InnerText text1={'Name'} text2={'Fatema'} />
          <InnerText text1={'Designation'} text2={'Web Developer'} />
          <InnerText text1={'Month / Year'} text2={'07 / 2023'} isBottom={false} />
        </InnerContainer>

        <View style={localStyles.cardHeading}><Text style={{color:'#fff'}}>Earnings</Text></View>
        <InnerContainer>
          <InnerText text1={'Basic Pay'} text2={'1000.00'} />
          <InnerText text1={'Transport Allowance'} text2={'110.00'} />
          <InnerText text1={'House Rent Allowance'} text2={'110.00'} />
          <InnerText text1={'Medical Allowance'} text2={'110.00'} />
          <InnerText text1={'OT Pay'} text2={'200.00'} />
          <InnerText text1={'PH Pay'} text2={'250.00'} isBottom={false} />
          <EDivider style={[styles.mv15,{backgroundColor:'#FA7547'}]} />
          <InnerText text1={'Salary / Gross Paid'} text2={'1,560.00'} isBottom={false} />
        </InnerContainer>
        <View style={localStyles.cardHeading}><Text style={{color:'#fff'}}>Deductions</Text></View>
        <InnerContainer>
          <InnerText text1={'Professional tax'} text2={'-'} />
          <InnerText text1={'Employee CPF'} text2={'-'} />
          <InnerText text1={'No pay leave'} text2={'-'} isBottom={false}/>
          <EDivider style={[styles.mv15,{backgroundColor:'#FA7547'}]} />
          <InnerText text1={'Total'} text2={'1,560.00'} isBottom={false} />
        </InnerContainer>
      </ScrollView>
    </>
  );
}

const localStyles = StyleSheet.create({
  barCodeImageStyle: {
    width: '100%',
    height: getHeight(130),
    ...styles.selfCenter,
    ...styles.mv10,
  },
  innerContainer: {
    ...styles.mv10,
    ...styles.pv15,
    ...styles.ph20,
    ...styles.mh20,
    borderRadius: moderateScale(5),
    ...styles.shadowStyle,
  },
  productImage: {
    width: moderateScale(55),
    height: moderateScale(55),
    borderRadius: moderateScale(55) / 2,
    resizeMode: 'contain',
  },
  renderItemContainer: {
    ...styles.rowSpaceBetween,
  },
  circleContainer: {
    width: moderateScale(13),
    height: moderateScale(13),
    borderRadius: moderateScale(13) / 2,
    // backgroundColor: '#7A5548',
    ...styles.ml10,
  },
  paidContainer: {
    ...styles.ph10,
    paddingVertical: getHeight(4),
    borderRadius: moderateScale(7),
    borderWidth: moderateScale(1),
  },
  root: {
    ...styles.p30,
    ...styles.mh30,
    borderRadius: moderateScale(15),
  },
  modalMainContainer: {
    ...styles.flex,
    ...styles.center,
    // backgroundColor: commonColor.modalBg,
  },
  btnContainerStyle: {
    ...styles.mh20,
    ...styles.mv10,
  },
  cardHeading:{
    backgroundColor:'#FA7547',
    ...styles.mt10,
    ...styles.pv15,
    ...styles.ph20,
    ...styles.mh20,
  }
});