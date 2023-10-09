import {StyleSheet, View, Text,ImageBackground} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {FlashList} from '@shopify/flash-list';

// Custom Imports
import {styles,colors} from '../../../themes';
import {popularEventData} from '../../../api/constant';
import HomeHeader from '../../../components/homeComponent/HomeHeader';
import SmallCardComponent from '../../../components/homeComponent/SmallCardComponent';
import {Clock,Caledar} from '../../../assets/svgs';
import EText from '../../../components/common/EText';
import EButton from '../../../components/common/EButton';

export default function HomeTab() {
  const colors = useSelector(state => state.theme.theme);
  // const userData = useSelector(state => state.user.userData);
  const [extraData, setExtraData] = useState(true);
  // const [user, setUserData] = useState();

  //   const getUser = async () => {
  //   let userData = await AsyncStorage.getItem('USER');
  //   userData = JSON.parse(userData);
  //   setUserData(userData);
  // };

  useEffect(() => {
    setExtraData(!extraData);
  }, [colors]);

  //   useEffect(() => {
  //   getUser();
  // }, []);

  
  const renderCategoryItem = ({item, index}) => {
    return <SmallCardComponent item={item} key={index}/>;
  };


  return (
    <View style={[styles.flexGrow1, {backgroundColor: '#f5f5f5'}]}>
      <FlashList
        data={popularEventData}
        extraData={extraData}
        renderItem={renderCategoryItem}
        keyExtractor={(item, index) => index.toString()}
        estimatedItemSize={10}
        numColumns={2}
        ListHeaderComponent={<RenderHeaderItem />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={localStyles.contentContainerStyle}
      />
       {/* <ImageBackground
  source={require('/SaifApp/saifApp/android/app/src/main/res/drawable/splash_logo.png')} // Replace with the actual image path
  style={localStyles.backgroundImage}
> */}
      {/* <View style={localStyles.bottomClock}>
        <View style={localStyles.btnContainer}>
            <View style={{flexDirection:'row', color:colors.primary5,alignItems:'center'}}>
              <Clock />
              <View style={{marginLeft:10}}>
                <EText type="m14" numberOfLines={1} color={colors.primary5}>Monday</EText>
                <EText type="m16" numberOfLines={1} color={colors.primary5}>14 Aug 2023</EText>
              </View>
            </View>
            <View style={{flexDirection:'row', color:colors.white,alignItems:'center'}}>
              <Clock />
              <View style={{marginLeft:10}}>
                <EText type="m14" numberOfLines={1} color={colors.primary5}>Shift</EText>
                <EText type="m16" numberOfLines={1} color={colors.primary5}>10:00AM - 00:00</EText>
              </View>
            </View>
        </View>
        <View style={localStyles.centeredTextContainer}>
    <EText type="m20" numberOfLines={1} color={colors.primary5}>
      <Clock /> 2h : 32m : 22s
    </EText>
  </View>

        <View style={localStyles.btnContainer}>
          <EButton
            title={strings.daycheckIn}
            type={'S16'}
            containerStyle={localStyles.skipBtnContainer}
            color={colors.white}
            // onPress={onPressCancel}
          />
          <EButton
            title={strings.nightcheckIn}
            type={'S16'}
            color={colors.white}
            containerStyle={localStyles.skipBtnContainer}
            // onPress={onPressLogOut}
          />
      </View>
      </View>
           */}
      {/* </ImageBackground>  */}
    </View>
    
  );
}

const RenderHeaderItem = React.memo(() => {
  return (
    <View>
      <HomeHeader />
      <ImageBackground
  source={require('/SaifApp/saifApp/android/app/src/main/res/drawable/splash_logo.png')} // Replace with the actual image path
  style={localStyles.backgroundImage}
>
  <View style={localStyles.card}>
    <View style={localStyles.left}>
      <EText type="m16" numberOfLines={1} color={colors.textColor}> Create Booking </EText>
      <EText color={colors.textColor} >Click create booking icon to book your slots for maximum 1 week.</EText>
    </View>
    <Caledar />
  </View>
</ImageBackground>

    </View>
  );
});

const localStyles = StyleSheet.create({
  contentContainerStyle: {
    ...styles.ph20,
    ...styles.pb20,
  },
  card:{
    // backgroundColor:'grey',
    display:'flex',
    justifyContent:'space-between',
    flexDirection:'row',
    ...styles.p20,
  },
  left:{
    maxWidth: '70%',
  },
  bottomClock:{
    // backgroundColor:'grey',
    ...styles.pv30,
    ...styles.ph30,
  },
  centeredTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center', 
  },
  btnContainer: {
    flexDirection:'row',
    justifyContent:'space-between',
    ...styles.mv15,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // You can adjust this to 'contain' or other values as needed
    justifyContent: 'center',
  },
  
  skipBtnContainer: {
    width: '45%',
  },
});
