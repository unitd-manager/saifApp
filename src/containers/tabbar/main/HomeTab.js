import { StyleSheet, View, Text, FlatList, Image,TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FlashList } from '@shopify/flash-list';
import { Tournament } from '../../../assets/svgs';
import { styles } from '../../../themes';
import api from '../../../api/api'
import HomeHeader from '../../../components/homeComponent/HomeHeader';
import SmallCardComponent from '../../../components/homeComponent/SmallCardComponent';
import EText from '../../../components/common/EText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deviceWidth, moderateScale } from '../../../common/constants';
import moment from 'moment';
import InAppUpdate from '../../../../InAppUpdate'

export default function HomeTab({ route }) {

  const colors = useSelector(state => state.theme.theme);
  const [extraData, setExtraData] = useState(true);
  const [user, setUserData] = useState();

  const getUser = async () => {
    let userData = await AsyncStorage.getItem('USER');
    userData = JSON.parse(userData);
    setUserData(userData);
  };

  const contactId = user ? user.contact_id : null;

  const [DATA, setData] = useState([])

  const isDatePassed = (date) => {
    return moment(date, 'YYYY-DD-MM').isBefore(moment(), 'day');
  };
  // Filter the data to exclude items with past dates
  // const filteredData = DATA.filter((item) => !isDatePassed(item.booking_date));

  const fetchBookingContact = (contactId) => {
    api
      .get('/booking/getBookingData')
      .then((res) => {
        const filteredData = res.data.data.filter((element) => element.contact_id === contactId);

        filteredData.forEach((element) => {
          element.tag = String(element.tag).split(',');
        });

        setData(filteredData);
      })
      .catch((error) => {
        console.log('Error fetching data:', error);
      });
  };

  useEffect(() => {
    if (route.params && route.params.insertedData) {
      setData((prevData) => [...prevData, route.params.insertedData]);
    }

    api
      .get('/booking/getBookingData')
      .then((res) => {
        const filteredData = res.data.data.filter((element) => element.contact_id === contactId);

        filteredData.forEach((element) => {
          element.tag = String(element.tag).split(',');
        });

        setData(filteredData);
      })
      .catch((error) => {
        console.log('Error fetching data:', error);
      });


  }, [route.params]);

  useEffect(() => {
    setExtraData(!extraData);
  }, [colors]);

  useEffect(() => {
    getUser();
    fetchBookingContact(contactId);
  }, [contactId]);

  const [amount, setAmount] = useState([])

  const CourtAmmount = () => {
    api
      .get('/setting/getCourtAmount')
      .then((res) => {
        setAmount(res.data.data);
      })
      .catch((error) => {
        console.log('Error fetching data:', error);
      });
  };

  useEffect(()=>{
    CourtAmmount();
  },[])

  // useEffect(()=>{
  //   InAppUpdate.checkUpdate()
  // },[])

  const renderCategoryItem = ({item, index}) => {
    return <SmallCardComponent item={item} key={index} user={user} />;
  };

  return (
    <View style={[styles.flexGrow1, { backgroundColor: '#f5f5f5', flexDirection: 'column' }]}>
      <HomeHeader user={user} />
      <FlashList
        data={amount}
        renderItem={renderCategoryItem}
        keyExtractor={(item, index) => index.toString()}
        estimatedItemSize={10}
        numColumns={2}
        ListHeaderComponent={<RenderHeaderItem />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={localStyles.contentContainerStyle}
        style={{ flex: 3 }}
      />

      <View style={localStyles.history}>
        <EText type="B20" numberOfLines={1} color="#222" style={{ margin: 20 }}>
          Booking History
        </EText>
      </View>

      <View style={[localStyles.loginBg, { flex: .7 }]}>

        {contactId ? (
          DATA.length > 0 ? (
            <FlatList
          data={DATA}
          renderItem={({ item, index }) => {
            const imageSource = item.hall === 'Court 1'
              ? require('../../../assets/images/court1.jpg')
              : item.hall === 'Court 2'
                ? require('../../../assets/images/court2.webp')
                : require('../../../assets/images/tumb.jpg');

            const backgroundColor = isDatePassed(item.booking_date) ? 'red' : item.color;


            return (
              <View style={{backgroundColor, width:'100%'}}>
                <View style={[localStyles.item]}>
                <Image
                      style={[localStyles.circular, { backgroundColor: item.color }]}
                      source={imageSource}
                    />
                  <View style={localStyles.itemLeft}>
                      <View style={localStyles.containerRow}>
                        <Text style={localStyles.heading}>{item.hall}</Text>
                        <Text style={localStyles.power}>{item.payment_status}</Text>
                      </View>
                      <View style={localStyles.containerRow}>
                        <Text style={localStyles.power}>{item.booking_date.split('-').reverse().join('-')}</Text>
                        <Text style={localStyles.power}>{item.assign_time}</Text>
                        <Text style={localStyles.power}>{item.to_assign_time}</Text>
                      </View>
                  </View>
                </View>
              </View>
            );
          }}
          keyExtractor={(item) => item.contact_id.toString()}
        /> 
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <EText type="m20" numberOfLines={1} color={'#fff'}> No Booking Records Found </EText>
            </View>
          )
        ) : (
          <Text>Book Your Court</Text>
        )}
      </View>
    </View>
  );
}

const RenderHeaderItem = React.memo(() => {
  return (
    <View>
      <View style={localStyles.card}>
        <View style={localStyles.left}>
          <EText type="m16" numberOfLines={1} color={'#fff'}>Tournament </EText>
          <Text style={{ color: '#fff' }}>Participate in a 2-hour tournament featuring intense rallying and competitive points.</Text>
        </View>
        <Tournament width={moderateScale(70)} height={moderateScale(70)} />
      </View>
      <EText type="B20" color="#222" style={{ marginTop: 20 }}>
        Our Court
      </EText>
    </View>
  );
});

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
    backgroundColor:'#000'
  },
  contentContainerStyle: {
    ...styles.ph20,
    ...styles.pb20,
  },
  containerRow:{
    display: 'flex', 
    flexDirection: 'row',
    justifyContent:'space-between',
  },
  card: {
    backgroundColor: '#13458cbd',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    ...styles.p10,
    ...styles.ph20,
  },
  left: {
    width: '70%',
  },
  loginBg: {
    backgroundColor: "#0d4c99",
    ...styles.ph20,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingTop: 10
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 75,
    width: '100%',
    alignSelf: 'center',
    borderBottomColor: '#dedede',
    borderBottomWidth: 0.5
  },
  itemLeft: {
    width:'80%'
  },
  heading: {
    fontSize: 16,
    color: '#fff',
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
    fontSize: 12,
    color: '#fff',
    marginRight: 15
  },
  history: {
    display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  }
});
