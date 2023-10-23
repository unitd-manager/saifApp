import { StyleSheet, View, Text, FlatList, Image } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FlashList } from '@shopify/flash-list';
import { Tournament } from '../../../assets/svgs';

// Custom Imports
import { styles } from '../../../themes';
import { popularEventData } from '../../../api/constant';
import api from '../../../api/api'
import HomeHeader from '../../../components/homeComponent/HomeHeader';
import SmallCardComponent from '../../../components/homeComponent/SmallCardComponent';
import EText from '../../../components/common/EText';
import { moderateScale } from '../../../common/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const fetchBookingContact = (contactId) => {
    api
      .get('/booking/getBookingData')
      .then((res) => {
        const filteredData = res.data.data.filter((element) => element.contact_id === contactId);

        filteredData.forEach((element) => {
          element.tag = String(element.tag).split(',');
        });

        setData(filteredData);

        console.log("DATA",DATA)
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


  const renderCategoryItem = ({ item, index }) => {
    return <SmallCardComponent item={item} key={index} user={user} />;
  };

  return (
    <View style={[styles.flexGrow1, { backgroundColor: '#f5f5f5', flexDirection: 'column' }]}>
      <HomeHeader user={user} />
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
        style={{ flex: 3 }}
      />

      <View style={localStyles.history}>
        <EText type="B20" numberOfLines={1} color="#222" style={{ margin: 20 }}>
          Booking History
        </EText>
        {/* <EText type="B14" numberOfLines={1} style={{ margin: 20, textDecorationLine: 'underline', }}>
          View All
        </EText> */}
      </View>

      <View style={[localStyles.loginBg, { flex: .7 }]}>

        {contactId ? (
          DATA.length > 0 ? (
            <FlatList
          data={DATA}
          renderItem={({ item, index }) => {
            const imageSource = item.hall === 'court 1'
              ? require('../../../assets/images/tumb.jpg')
              : item.hall === 'court 2'
                ? require('../../../assets/images/court2.webp')
                : require('../../../assets/images/tumb.jpg');

            return (
              <View style={localStyles.item}>
                <Image
                    style={[localStyles.circular, { backgroundColor: item.color }]}
                    source={imageSource}
                  />
                <View style={localStyles.itemLeft}>
                    <View style={localStyles.containerRow}>
                      <Text style={localStyles.heading}>{item.hall}</Text>
                      <Text style={localStyles.power}>{item.total_hour}</Text>
                    </View>
                    <View style={localStyles.containerRow}>
                      <Text style={localStyles.power}>{item.booking_date}</Text>
                      <Text style={localStyles.power}>{item.assign_time}</Text>
                      <Text style={localStyles.power}>{item.to_assign_time}</Text>
                      {/* {item.total_hour_per_rate && <Text style={localStyles.power}>{item.total_hour_per_rate} rs/-</Text> }  */}
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
          <EText type="m16" numberOfLines={1} color={'#fff'}> Tournament </EText>
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
    width: '95%',
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
