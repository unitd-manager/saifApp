import { StyleSheet, View, Text, FlatList,Image } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FlashList } from '@shopify/flash-list';
import {Tournament} from '../../../assets/svgs';

// Custom Imports
import { styles, colors } from '../../../themes';
import { popularEventData } from '../../../api/constant';
import HomeHeader from '../../../components/homeComponent/HomeHeader';
import SmallCardComponent from '../../../components/homeComponent/SmallCardComponent';
import EText from '../../../components/common/EText';
import { moderateScale } from '../../../common/constants';

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


  const [DATA, setData] = React.useState([
    { id: '1', thumbimg: require('../../../assets/images/tumb.jpg'), heading: 'Tim Chow Court ', power: '10-10-23', color: '#30B69E', amount: "60 rs/-" },
    { id: '2', thumbimg: require('../../../assets/images/tumb.jpg'), heading: 'Tim Chow Court ', power: '10-10-23', color: '#F8C666', amount: "60 rs/-" },
    { id: '4', thumbimg: require('../../../assets/images/tumb.jpg'), heading: 'Tim Chow Court ', power: '10-10-23', color: '#678FCB', amount: "60 rs/-" },
    { id: '5', thumbimg: require('../../../assets/images/tumb.jpg'), heading: 'Tim Chow Court ', power: '10-10-23', color: '#D47DE2', amount: "60 rs/-" }
  ])

  useEffect(() => {
    setExtraData(!extraData);
  }, [colors]);

  //   useEffect(() => {
  //   getUser();
  // }, []);


  const renderCategoryItem = ({ item, index }) => {
    return <SmallCardComponent item={item} key={index} />;
  };

  return (
    <View style={[styles.flexGrow1, { backgroundColor: '#f5f5f5', flexDirection: 'column'  }]}>
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
        style={{flex:3}}
      />

<EText type="B20" numberOfLines={1} color="#222" style={{ margin: 20 }}>
  Booking History
</EText>

      <View style={[localStyles.loginBg, { flex: .7 }]}>
      
        <FlatList
          data={DATA}
          renderItem={({ item, index }) => {
            return (
              <View style={localStyles.item}>

                <View style={localStyles.itemLeft}>
                <Image
                    style={[localStyles.circular, { backgroundColor: item.color }]}
                    source={item.thumbimg}
                />
                  <View>
                    <Text style={localStyles.heading}>{item.heading}</Text>
                    <Text style={localStyles.power}>{item.power}</Text>
                  </View>
                </View>
                <Text style={localStyles.power}>{item.amount}</Text>
              </View>
            )
          }}
          keyExtractor={item => item.id}
        />
      </View>

    </View>

  );
}

const RenderHeaderItem = React.memo(() => {
  return (
    <View>
      <HomeHeader />
      <View style={localStyles.card}>
        <View style={localStyles.left}>
          <EText type="m16" numberOfLines={1} color={'#fff'}> Tournament </EText>
          <Text style={{color:'#fff'}}>Participate in a 2-hour tournament featuring intense rallying and competitive points.</Text>
        </View>
        <Tournament width={moderateScale(70)} height={moderateScale(70)} />
      </View>
      <EText type="B20" color="#222" style={{marginTop:20}}>
        Our Court
      </EText>
    </View>
  );
});

const localStyles = StyleSheet.create({
  contentContainerStyle: {
    ...styles.ph20,
    ...styles.pb20,
  },
  card: {
    backgroundColor:'#13458cbd',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    ...styles.p10,
    ...styles.ph20,
  },
  left: {
    maxWidth: '70%',
  },
  loginBg: {
    backgroundColor: "#0d4c99",
    ...styles.ph20,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingTop: 10
  },

  item: {
    // backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 70,
    width: '95%',
    alignSelf: 'center',
    // marginVertical: 10,
    borderBottomColor: '#dedede',
    borderBottomWidth: 0.5
  },
  itemLeft: {
    flexDirection: 'row',

  },
  heading: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  circular: {
    width: 50,
    height: 50,
    backgroundColor: '#30B69E',
    borderRadius: 100,
    marginRight: 15,
  },
  itemText: {
    maxWidth: '80%',
  },
  power: {
    fontSize: 14,
    color: '#fff',
  },

});
